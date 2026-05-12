namespace LabourLinkAPI.Contracts.JobSeeker;

public class UpdateJobSeekerProfileRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Education { get; set; }
    public string? Qualifications { get; set; }
    public string? Languages { get; set; }
    public string? Location { get; set; }
    public string? Resume { get; set; }
    public string? DesiredJobRole { get; set; }
    public string? DesiredLocation { get; set; }
}

public class JobSeekerProfileResponse
{
    public Guid JobSeekerId { get; set; }
    public Guid UserId { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Education { get; set; }
    public string? Qualifications { get; set; }
    public string? Languages { get; set; }
    public string? Location { get; set; }
    public string? Resume { get; set; }
}

public class JobSearchResponse
{
    public Guid JobId { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public string? Category { get; set; }
    public string? EmploymentType { get; set; }
    public DateTime PostedDate { get; set; }
    public int? ViewCount { get; set; }
    public AgencySummaryResponse? Agency { get; set; }
}

public class AgencySummaryResponse
{
    public Guid AgencyId { get; set; }
    public string Name { get; set; } = default!;
    public string? Logo { get; set; }
}

public class JobDetailResponse
{
    public Guid JobId { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string Location { get; set; } = default!;
    public decimal SalaryMin { get; set; }
    public decimal SalaryMax { get; set; }
    public string Category { get; set; } = default!;
    public string EmploymentType { get; set; } = default!;
    public int ViewCount { get; set; }
    public DateTime PostedDate { get; set; }
    public DateTime? DeadlineDate { get; set; }
    public int ApplicationCount { get; set; }
    public AgencyDetailResponse Agency { get; set; } = default!;
}

public class AgencyDetailResponse
{
    public Guid AgencyId { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? Logo { get; set; }
    public string? Website { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
}

public class JobApplicationRequest
{
    public string? CoverLetter { get; set; }
    public string? ResumeUrl { get; set; }
}

public class JobApplicationResponse
{
    public Guid ApplicationId { get; set; }
    public string Status { get; set; } = default!;
    public DateTime AppliedDate { get; set; }
}

public class JobApplicationListResponse
{
    public Guid ApplicationId { get; set; }
    public string JobTitle { get; set; } = default!;
    public string Status { get; set; } = default!;
    public DateTime AppliedDate { get; set; }
    public DateTime? ResponseDate { get; set; }
    public string? AgencyName { get; set; }
}

public class JobApplicationDetailResponse
{
    public Guid ApplicationId { get; set; }
    public string Status { get; set; } = default!;
    public string? CoverLetter { get; set; }
    public string? ResumeUrl { get; set; }
    public DateTime AppliedDate { get; set; }
    public DateTime? ResponseDate { get; set; }
    public string? RejectionReason { get; set; }
    public JobDetailResponse Job { get; set; } = default!;
}

public class SaveJobRequest
{
    public Guid JobId { get; set; }
}

public class SavedJobResponse
{
    public Guid JobId { get; set; }
    public string Title { get; set; } = default!;
    public string? Location { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public DateTime SavedDate { get; set; }
    public DateTime PostedDate { get; set; }
}
