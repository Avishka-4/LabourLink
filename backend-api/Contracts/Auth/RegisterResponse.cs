namespace LabourLinkAPI.Contracts.Auth;

public sealed class RegisterResponse
{
    public Guid UserId { get; init; }
    public string Email { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
}
