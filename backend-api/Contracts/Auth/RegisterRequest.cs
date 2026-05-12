using System.ComponentModel.DataAnnotations;
using LabourLinkAPI.Models.Enums;

namespace LabourLinkAPI.Contracts.Auth;

public sealed class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; init; } = string.Empty;

    [Required]
    [Compare(nameof(Password))]
    public string ConfirmPassword { get; init; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string FullName { get; init; } = string.Empty;

    [Required]
    public UserRole Role { get; init; }

    [Phone]
    public string? PhoneNumber { get; init; }
}
