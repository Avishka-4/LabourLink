using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using LabourLinkAPI.Contracts.Auth;
using LabourLinkAPI.Data;
using LabourLinkAPI.Models.Enums;
using LabourLinkAPI.Services.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Xunit;

namespace LabourLinkAPI.Tests.Services;

public class AuthServiceTests
{
    private static (AuthService Service, LabourLinkDbContext Db) CreateService()
    {
        var options = new DbContextOptionsBuilder<LabourLinkDbContext>()
            .UseInMemoryDatabase($"auth-test-{Guid.NewGuid()}")
            .Options;

        var db = new LabourLinkDbContext(options);
        var jwtOptions = Options.Create(new JwtOptions
        {
            Issuer = "LabourLink",
            Audience = "LabourLink",
            Key = "TestKey_ChangeMe_AtLeast32Characters",
            ExpiryMinutes = 60,
        });

        var tokenService = new TokenService(jwtOptions);
        var passwordHashService = new PasswordHashService();
        var service = new AuthService(db, passwordHashService, tokenService);

        return (service, db);
    }

    [Fact]
    public async Task RegisterAsync_creates_user()
    {
        var (service, db) = CreateService();
        var request = new RegisterRequest
        {
            Email = "worker@test.com",
            Password = "Password123",
            ConfirmPassword = "Password123",
            FullName = "Test Worker",
            Role = UserRole.Worker,
        };

        var response = await service.RegisterAsync(request, CancellationToken.None);

        response.Email.Should().Be("worker@test.com");
        (await db.Users.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task LoginAsync_returns_tokens()
    {
        var (service, _) = CreateService();

        await service.RegisterAsync(new RegisterRequest
        {
            Email = "worker2@test.com",
            Password = "Password123",
            ConfirmPassword = "Password123",
            FullName = "Test Worker",
            Role = UserRole.Worker,
        }, CancellationToken.None);

        var response = await service.LoginAsync(new LoginRequest
        {
            Email = "worker2@test.com",
            Password = "Password123",
        }, CancellationToken.None);

        response.Token.Should().NotBeNullOrWhiteSpace();
        response.RefreshToken.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task RefreshTokenAsync_rotates_tokens()
    {
        var (service, db) = CreateService();

        await service.RegisterAsync(new RegisterRequest
        {
            Email = "worker3@test.com",
            Password = "Password123",
            ConfirmPassword = "Password123",
            FullName = "Test Worker",
            Role = UserRole.Worker,
        }, CancellationToken.None);

        var login = await service.LoginAsync(new LoginRequest
        {
            Email = "worker3@test.com",
            Password = "Password123",
        }, CancellationToken.None);

        var refresh = await service.RefreshTokenAsync(new RefreshTokenRequest
        {
            RefreshToken = login.RefreshToken,
        }, CancellationToken.None);

        refresh.Token.Should().NotBeNullOrWhiteSpace();
        refresh.RefreshToken.Should().NotBeNullOrWhiteSpace();

        var revoked = await db.RefreshTokens.FirstAsync();
        revoked.RevokedAt.Should().NotBeNull();
        (await db.RefreshTokens.CountAsync()).Should().Be(2);
    }

    [Fact]
    public async Task ForgotPasswordAsync_creates_token()
    {
        var (service, db) = CreateService();

        await service.RegisterAsync(new RegisterRequest
        {
            Email = "worker4@test.com",
            Password = "Password123",
            ConfirmPassword = "Password123",
            FullName = "Test Worker",
            Role = UserRole.Worker,
        }, CancellationToken.None);

        var response = await service.ForgotPasswordAsync(new ForgotPasswordRequest
        {
            Email = "worker4@test.com",
        }, CancellationToken.None);

        response.Message.Should().NotBeNullOrWhiteSpace();
        (await db.PasswordResetTokens.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task ResetPasswordAsync_updates_hash()
    {
        var (service, db) = CreateService();

        await service.RegisterAsync(new RegisterRequest
        {
            Email = "worker5@test.com",
            Password = "Password123",
            ConfirmPassword = "Password123",
            FullName = "Test Worker",
            Role = UserRole.Worker,
        }, CancellationToken.None);

        await service.ForgotPasswordAsync(new ForgotPasswordRequest
        {
            Email = "worker5@test.com",
        }, CancellationToken.None);

        var token = await db.PasswordResetTokens.FirstAsync();

        var response = await service.ResetPasswordAsync(new ResetPasswordRequest
        {
            Email = "worker5@test.com",
            Token = token.Token,
            NewPassword = "NewPassword123",
            ConfirmPassword = "NewPassword123",
        }, CancellationToken.None);

        response.Message.Should().Be("Password reset successfully");

        var user = await db.Users.FirstAsync();
        var hashService = new PasswordHashService();
        hashService.Verify("NewPassword123", user.PasswordHash).Should().BeTrue();
    }
}
