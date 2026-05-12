using System.ComponentModel.DataAnnotations;
using LabourLinkAPI.Models.Enums;

namespace LabourLinkAPI.Models.Entities;

public class RecruitmentAgency : IAuditableEntity
{
    [Key]
    public Guid AgencyId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(255)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string CompanyRegistrationNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LicenseNumber { get; set; } = string.Empty;

    [Required]
    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Pending;

    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedBy { get; set; }

    [Required]
    [MaxLength(500)]
    public string BusinessAddress { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? WebsiteUrl { get; set; }

    public int? NumberOfEmployees { get; set; }
    public int? EstablishedYear { get; set; }

    [Required]
    [MaxLength(50)]
    public string TaxId { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string BankAccount { get; set; } = string.Empty;

    public List<string> OperatingCountries { get; set; } = new();
    public List<string> Certifications { get; set; } = new();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public User? VerifiedByUser { get; set; }

    public ICollection<JobPosting> JobPostings { get; set; } = new List<JobPosting>();
}
