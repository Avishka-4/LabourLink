using System.ComponentModel.DataAnnotations;
using LabourLinkAPI.Models.Enums;

namespace LabourLinkAPI.Models.Entities;

public class JobApplication : IAuditableEntity
{
    [Key]
    public Guid ApplicationId { get; set; }

    [Required]
    public Guid JobId { get; set; }

    [Required]
    public Guid JobSeekerId { get; set; }

    public Guid? WorkerId { get; set; }

    [Required]
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

    public string? CoverLetter { get; set; }

    [MaxLength(500)]
    public string? ResumeUrl { get; set; }

    public DateTime AppliedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public Guid? ReviewedBy { get; set; }

    [MaxLength(500)]
    public string? RejectionReason { get; set; }

    [Range(1, 5)]
    public int? Rating { get; set; }

    public string? Comments { get; set; }
    public DateTime? InterviewDate { get; set; }

    [MaxLength(255)]
    public string? InterviewLocation { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public JobPosting? Job { get; set; }
    public JobSeeker? JobSeeker { get; set; }
    public Worker? Worker { get; set; }
    public User? ReviewedByUser { get; set; }
}
