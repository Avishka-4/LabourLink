using System.ComponentModel.DataAnnotations;
using LabourLinkAPI.Models.Enums;

namespace LabourLinkAPI.Models.Entities;

public class JobPosting : IAuditableEntity
{
    [Key]
    public Guid JobId { get; set; }

    [Required]
    public Guid AgencyId { get; set; }

    [Required]
    [MaxLength(255)]
    public string JobTitle { get; set; } = string.Empty;

    [Required]
    public string JobDescription { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? JobCategory { get; set; }

    [Required]
    public EmploymentType EmploymentType { get; set; }

    [Required]
    [MaxLength(255)]
    public string Location { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Country { get; set; }

    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }

    [MaxLength(10)]
    public string? SalaryCurrency { get; set; }

    public List<string> Requirements { get; set; } = new();

    public List<string> Benefits { get; set; } = new();

    public int? RequiredExperience { get; set; }

    [MaxLength(100)]
    public string? EducationRequired { get; set; }

    public DateOnly? ApplicationDeadline { get; set; }

    [Required]
    public JobStatus Status { get; set; } = JobStatus.Draft;

    public int ViewCount { get; set; }
    public int ApplyCount { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime? FeaturedUntil { get; set; }
    public DateTime PostedAt { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public RecruitmentAgency? Agency { get; set; }
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}