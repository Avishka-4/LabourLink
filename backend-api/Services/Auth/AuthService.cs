using System.Security.Cryptography;
using LabourLinkAPI.Contracts.Auth;
using LabourLinkAPI.Data;
using LabourLinkAPI.Models.Entities;
using LabourLinkAPI.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace LabourLinkAPI.Services.Auth;

public sealed class AuthService : IAuthService
{
    private readonly LabourLinkDbContext _db;
    private readonly IPasswordHashService _passwordHashService;
    private readonly ITokenService _tokenService;

    public AuthService(
        LabourLinkDbContext db,
        IPasswordHashService passwordHashService,
        ITokenService tokenService)
    {
        _db = db;
        _passwordHashService = passwordHashService;
        _tokenService = tokenService;
    }

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var exists = await _db.Users.AnyAsync(u => u.Email.ToLower() == email, cancellationToken);
        if (exists)
        {
            throw new InvalidOperationException("Email already exists");
        }

        var (firstName, lastName) = SplitName(request.FullName);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Email = email,
            PasswordHash = _passwordHashService.Hash(request.Password),
            PhoneNumber = request.PhoneNumber,
            FirstName = firstName,
            LastName = lastName,
            Role = request.Role,
            Status = UserStatus.Active,
            IsEmailVerified = false,
            IsPhoneVerified = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);

        return new RegisterResponse
        {
            UserId = user.UserId,
            Email = user.Email,
            Message = "Registered successfully",
        };
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email, cancellationToken);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        if (user.Status is UserStatus.Banned or UserStatus.Suspended)
        {
            throw new UnauthorizedAccessException("User is not allowed to login");
        }

        var ok = _passwordHashService.Verify(request.Password, user.PasswordHash);
        if (!ok)
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        user.LastLoginAt = DateTime.UtcNow;

        var (accessToken, expiresIn) = _tokenService.CreateAccessToken(user);
        var refreshTokenValue = _tokenService.CreateRefreshToken();

        var refreshToken = new RefreshToken
        {
            TokenId = Guid.NewGuid(),
            UserId = user.UserId,
            Token = refreshTokenValue,
            CreatedAt = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddDays(14),
        };

        _db.RefreshTokens.Add(refreshToken);
        await _db.SaveChangesAsync(cancellationToken);

        return new LoginResponse
        {
            UserId = user.UserId,
            Email = user.Email,
            Role = user.Role.ToString(),
            Token = accessToken,
            RefreshToken = refreshTokenValue,
            ExpiresIn = expiresIn,
        };
    }

    public async Task<RefreshTokenResponse> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        var tokenValue = request.RefreshToken.Trim();

        var token = await _db.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == tokenValue, cancellationToken);

        if (token == null || token.User == null)
        {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        if (token.RevokedAt != null || token.ExpiryDate <= DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Refresh token expired or revoked");
        }

        // Rotate
        token.RevokedAt = DateTime.UtcNow;

        var (accessToken, expiresIn) = _tokenService.CreateAccessToken(token.User);
        var newRefreshValue = _tokenService.CreateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            TokenId = Guid.NewGuid(),
            UserId = token.UserId,
            Token = newRefreshValue,
            CreatedAt = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddDays(14),
        });

        await _db.SaveChangesAsync(cancellationToken);

        return new RefreshTokenResponse
        {
            Token = accessToken,
            RefreshToken = newRefreshValue,
            ExpiresIn = expiresIn,
        };
    }

    public async Task<MessageResponse> LogoutAsync(LogoutRequest request, CancellationToken cancellationToken)
    {
        var tokens = await _db.RefreshTokens
            .Where(t => t.UserId == request.UserId && t.RevokedAt == null && t.ExpiryDate > DateTime.UtcNow)
            .ToListAsync(cancellationToken);

        foreach (var token in tokens)
        {
            token.RevokedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(cancellationToken);

        return new MessageResponse { Message = "Logged out successfully" };
    }

    public async Task<MessageResponse> ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email, cancellationToken);

        if (user != null)
        {
            var tokenValue = CreateResetToken();
            _db.PasswordResetTokens.Add(new PasswordResetToken
            {
                TokenId = Guid.NewGuid(),
                UserId = user.UserId,
                Token = tokenValue,
                CreatedAt = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddHours(2),
            });

            await _db.SaveChangesAsync(cancellationToken);
        }

        return new MessageResponse
        {
            Message = "If an account exists, a reset link has been sent.",
        };
    }

    public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email, cancellationToken);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid reset token");
        }

        var tokenValue = request.Token.Trim();
        var token = await _db.PasswordResetTokens
            .FirstOrDefaultAsync(t => t.UserId == user.UserId && t.Token == tokenValue, cancellationToken);

        if (token == null || token.UsedAt != null || token.ExpiryDate <= DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Invalid or expired reset token");
        }

        user.PasswordHash = _passwordHashService.Hash(request.NewPassword);
        token.UsedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);

        return new ResetPasswordResponse
        {
            Message = "Password reset successfully",
        };
    }

    private static (string FirstName, string LastName) SplitName(string fullName)
    {
        var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0)
        {
            return ("", "");
        }

        if (parts.Length == 1)
        {
            return (parts[0], "");
        }

        var first = parts[0];
        var last = string.Join(' ', parts.Skip(1));
        return (first, last);
    }

    private static string CreateResetToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(48);
        return Convert.ToBase64String(bytes);
    }
}
