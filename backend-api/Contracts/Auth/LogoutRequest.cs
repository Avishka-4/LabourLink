using System.ComponentModel.DataAnnotations;

namespace LabourLinkAPI.Contracts.Auth;

public sealed class LogoutRequest
{
    [Required]
    public Guid UserId { get; init; }
}
