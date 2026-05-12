using System.ComponentModel.DataAnnotations;
using LabourLinkAPI.Models.Enums;

namespace LabourLinkAPI.Models.Entities;

public class JobSeeker : IAuditableEntity
{
    [Key]
    public Guid JobSeekerId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public EducationLevel EducationLevel { get; set; }

    [Required]
    public string Qualification { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string DesiredJobRole { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string DesiredLocation { get; set; } = string.Empty;

    public decimal? ExpectedSalary { get; set; }

    public bool IsAvailable { get; set; } = true;

    public DateOnly? AvailabilityDate { get; set; }

    public List<string> Languages { get; set; } = new();
    public List<string> Certifications { get; set; } = new();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}
