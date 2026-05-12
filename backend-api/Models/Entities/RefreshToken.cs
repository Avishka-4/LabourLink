using System.ComponentModel.DataAnnotations;

namespace LabourLinkAPI.Models.Entities;

public class RefreshToken
{
    [Key]
    public Guid TokenId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Token { get; set; } = string.Empty;

    [Required]
    public DateTime ExpiryDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? RevokedAt { get; set; }

    public User? User { get; set; }
}
