using System.ComponentModel.DataAnnotations;
using LabourLinkAPI.Models.Enums;

namespace LabourLinkAPI.Models.Entities;

public class Worker : IAuditableEntity
{
    [Key]
    public Guid WorkerId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(50)]
    public string WorkerRegistrationNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Nationality { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string PassportNumber { get; set; } = string.Empty;

    [Required]
    public DateOnly DateOfBirth { get; set; }

    [Required]
    public Gender Gender { get; set; }

    [Required]
    [MaxLength(255)]
    public string CurrentLocation { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? DesiredLocation { get; set; }

    public int YearsOfExperience { get; set; }

    public List<string> Skills { get; set; } = new();

    [Required]
    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Pending;

    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedBy { get; set; }

    [Required]
    [MaxLength(100)]
    public string EmergencyContactName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string EmergencyContactPhone { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public User? VerifiedByUser { get; set; }

    public ICollection<WorkerComplaint> Complaints { get; set; } = new List<WorkerComplaint>();
    public ICollection<JobApplication> JobApplications { get; set; } = new List<JobApplication>();
}
