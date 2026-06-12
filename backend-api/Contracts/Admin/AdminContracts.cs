namespace LabourLinkAPI.Contracts.Admin;

public class UpdateUserStatusRequest
{
    public string Status { get; set; } = default!;
}

public class UserListResponse
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Role { get; set; } = default!;
    public string Status { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}

public class UserDetailResponse
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string Role { get; set; } = default!;
    public string Status { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
}

public class PendingVerificationResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public DateTime SubmittedAt { get; set; }
}

public class VerificationRequest
{
    public bool IsApproved { get; set; }
    public string? RejectionReason { get; set; }
}

public class PendingJobResponse
{
    public Guid JobId { get; set; }
    public string Title { get; set; } = default!;
    public string AgencyName { get; set; } = default!;
    public DateTime SubmittedAt { get; set; }
}

public class ApprovalRequest
{
    public bool IsApproved { get; set; }
    public string? RejectionReason { get; set; }
}

public class ComplaintListResponse
{
    public Guid ComplaintId { get; set; }
    public string Type { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string Priority { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public string? WorkerName { get; set; }
}

public class ComplaintDetailResponse
{
    public Guid ComplaintId { get; set; }
    public string Type { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string Priority { get; set; } = default!;
    public string? WorkerName { get; set; }
    public string? WorkerEmail { get; set; }
    public string? TargetAgencyName { get; set; }
    public string? AttachmentUrl { get; set; }
    public string? ResolutionNotes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}

public class AssignComplaintRequest
{
    public Guid AssignedToAdminId { get; set; }
}

public class UpdateComplaintStatusRequest
{
    public string Status { get; set; } = default!;
    public string? ResolutionNotes { get; set; }
}

public class CreateNewsRequest
{
    public string Title { get; set; } = default!;
    public string Content { get; set; } = default!;
    public string Category { get; set; } = default!;
    public int Priority { get; set; }
    public string? ImageUrl { get; set; }
}

public class UpdateNewsRequest
{
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? Category { get; set; }
    public int? Priority { get; set; }
    public string? ImageUrl { get; set; }
}

public class NewsResponse
{
    public Guid NewsId { get; set; }
    public string Title { get; set; } = default!;
    public string Content { get; set; } = default!;
    public string Category { get; set; } = default!;
    public int Priority { get; set; }
    public string? ImageUrl { get; set; }
    public string Status { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
}

public class PublishNewsRequest
{
    public bool PublishNow { get; set; } = true;
    public DateTime? ScheduleDate { get; set; }
}

public class AuditLogResponse
{
    public long LogId { get; set; }
    public Guid? UserId { get; set; }
    public string Action { get; set; } = default!;
    public string EntityType { get; set; } = default!;
    public string? EntityId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public DateTime Timestamp { get; set; }
}

public class AdminStatisticsResponse
{
    public int TotalUsers { get; set; }
    public int TotalJobs { get; set; }
    public int TotalApplications { get; set; }
    public int TotalComplaints { get; set; }
    public int PendingVerifications { get; set; }
    public int PendingApprovals { get; set; }
}
