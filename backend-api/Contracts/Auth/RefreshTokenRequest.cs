using System.ComponentModel.DataAnnotations;

namespace LabourLinkAPI.Contracts.Auth;

public sealed class RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; init; } = string.Empty;
}
