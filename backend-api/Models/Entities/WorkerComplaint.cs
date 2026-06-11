using System.ComponentModel.DataAnnotations;
using LabourLinkAPI.Models.Enums;

namespace LabourLinkAPI.Models.Entities;

public class WorkerComplaint : IAuditableEntity
{
    [Key]
    public Guid ComplaintId { get; set; }

    [Required]
    public Guid WorkerId { get; set; }

    [Required]
    public ComplaintType ComplaintType { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? AttachmentUrl { get; set; }

    [Required]
    public ComplaintStatus Status { get; set; } = ComplaintStatus.Submitted;

    [Required]
    public Priority Priority { get; set; } = Priority.Medium;

    public Guid? AssignedToAdminId { get; set; }

    public string? ResolutionNotes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }

    [MaxLength(255)]
    public string? TargetAgencyName { get; set; }

    public Worker? Worker { get; set; }
    public User? AssignedToAdmin { get; set; }
}