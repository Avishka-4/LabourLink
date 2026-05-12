namespace LabourLinkAPI.Contracts.Auth;

public sealed class RefreshTokenResponse
{
    public string Token { get; init; } = string.Empty;
    public string RefreshToken { get; init; } = string.Empty;
    public int ExpiresIn { get; init; }
}
