using System.ComponentModel.DataAnnotations;

namespace LabourLinkAPI.Models.Entities;

public class SavedJob
{
    [Key]
    public Guid SavedJobId { get; set; }

    [Required]
    public Guid JobSeekerId { get; set; }

    [Required]
    public Guid JobId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public JobSeeker? JobSeeker { get; set; }
    public JobPosting? Job { get; set; }
}
