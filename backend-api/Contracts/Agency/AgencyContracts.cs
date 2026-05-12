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
