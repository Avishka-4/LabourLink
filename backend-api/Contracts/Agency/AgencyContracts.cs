namespace LabourLinkAPI.Contracts.Agency;

public class UpdateAgencyProfileRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Logo { get; set; }
    public string? Website { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? Address { get; set; }
    public string? LicenseNumber { get; set; }
    public string? CompanyRegistrationNumber { get; set; }
    public string? BusinessAddress { get; set; }
    public string? TaxId { get; set; }
    public string? BankAccount { get; set; }
}

public class AgencyProfileResponse
{
    public Guid AgencyId { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? Logo { get; set; }
    public string? Website { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? Address { get; set; }
    public string Status { get; set; } = default!;
}

public class CreateJobRequest
{
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string Location { get; set; } = default!;
    public decimal SalaryMin { get; set; }
    public decimal SalaryMax { get; set; }
    public string Category { get; set; } = default!;
    public string EmploymentType { get; set; } = default!;
    public DateTime? DeadlineDate { get; set; }
    public bool PublishNow { get; set; } = true;
    public List<string>? Benefits { get; set; }
}

public class UpdateJobRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public string? Category { get; set; }
    public string? EmploymentType { get; set; }
    public DateTime? DeadlineDate { get; set; }
    public List<string>? Benefits { get; set; }
}

public class JobPostingResponse
{
    public Guid JobId { get; set; }
    public string Title { get; set; } = default!;
    public string Status { get; set; } = default!;
    public int ApplicationCount { get; set; }
    public int ViewCount { get; set; }
    public DateTime PostedDate { get; set; }
}

public class JobPostingDetailResponse
{
    public Guid JobId { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string Location { get; set; } = default!;
    public decimal SalaryMin { get; set; }
    public decimal SalaryMax { get; set; }
    public string Category { get; set; } = default!;
    public string Status { get; set; } = default!;
    public int ApplicationCount { get; set; }
    public int ViewCount { get; set; }
    public DateTime PostedDate { get; set; }
    public List<string> Benefits { get; set; } = new();
}

public class UpdateApplicationStatusRequest
{
    public string Status { get; set; } = default!;
    public string? RejectionReason { get; set; }
}

public class ApplicationWithApplicantResponse
{
    public Guid ApplicationId { get; set; }
    public string Status { get; set; } = default!;
    public DateTime AppliedDate { get; set; }
    public ApplicantPreviewResponse Applicant { get; set; } = default!;
    public string JobTitle { get; set; } = default!;
}

public class ApplicantPreviewResponse
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string? PhoneNumber { get; set; }
}

public class AgencyStatisticsResponse
{
    public int TotalJobs { get; set; }
    public int TotalApplications { get; set; }
    public int TotalViewCount { get; set; }
    public int ApprovedJobs { get; set; }
    public int DraftJobs { get; set; }
}

public class AgencyComplaintResponse
{
    public Guid ComplaintId { get; set; }
    public string Title { get; set; } = default!;
    public string Type { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string? WorkerName { get; set; }
    public string? ResolutionNotes { get; set; }
    public int? WorkerRating { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}

public class ResolveComplaintRequest
{
    public string ResolutionDescription { get; set; } = default!;
}

public class AgencyRatingResponse
{
    public double AverageRating { get; set; }
    public int TotalRatings { get; set; }
    public int FiveStarCount { get; set; }
    public int OneStarCount { get; set; }
}

public class JobAnalyticsSummary
{
    public Guid JobId { get; set; }
    public string Title { get; set; } = default!;
    public string Status { get; set; } = default!;
    public int ApplicationCount { get; set; }
    public int ViewCount { get; set; }
    public DateTime PostedDate { get; set; }
}

public class AgencyAnalyticsResponse
{
    public int TotalJobs { get; set; }
    public int PublishedJobs { get; set; }
    public int DraftJobs { get; set; }
    public int ClosedJobs { get; set; }
    public int TotalApplications { get; set; }
    public int PendingApplications { get; set; }
    public int ReviewingApplications { get; set; }
    public int AcceptedApplications { get; set; }
    public int RejectedApplications { get; set; }
    public int TotalViews { get; set; }
    public List<JobAnalyticsSummary> TopJobsByApplications { get; set; } = new();
    public List<JobAnalyticsSummary> TopJobsByViews { get; set; } = new();
}
