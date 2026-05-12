using System.ComponentModel.DataAnnotations;
using LabourLinkAPI.Models.Enums;

namespace LabourLinkAPI.Models.Entities;

public class News : IAuditableEntity
{
    [Key]
    public Guid NewsId { get; set; }

    [Required]
    public Guid CreatedByAdminId { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [Required]
    public NewsCategory Category { get; set; }

    [Required]
    public Priority Priority { get; set; }

    [MaxLength(500)]
    public string? FeaturedImageUrl { get; set; }

    public bool IsPublished { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public int ViewCount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User? CreatedByAdmin { get; set; }
}
