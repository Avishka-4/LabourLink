using System.ComponentModel.DataAnnotations;
using LabourLinkAPI.Models.Enums;

namespace LabourLinkAPI.Models.Entities;

public class User : IAuditableEntity
{
    [Key]
    public Guid UserId { get; set; }

    [EmailAddress]
    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; }

    public bool IsEmailVerified { get; set; }
    public bool IsPhoneVerified { get; set; }

    [Required]
    public UserStatus Status { get; set; } = UserStatus.Active;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }

    [MaxLength(500)]
    public string? ProfileImageUrl { get; set; }

    public Worker? Worker { get; set; }
    public JobSeeker? JobSeeker { get; set; }
    public RecruitmentAgency? Agency { get; set; }

    public ICollection<WorkerComplaint> AssignedComplaints { get; set; } = new List<WorkerComplaint>();
    public ICollection<News> CreatedNews { get; set; } = new List<News>();
    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<JobApplication> ReviewedApplications { get; set; } = new List<JobApplication>();
}
