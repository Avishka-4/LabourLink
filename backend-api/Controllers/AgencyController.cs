using System.Security.Claims;
using LabourLinkAPI.Contracts.Agency;
using LabourLinkAPI.Contracts.Auth;
using LabourLinkAPI.Data;
using LabourLinkAPI.Models.Entities;
using LabourLinkAPI.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabourLinkAPI.Controllers;

[ApiController]
[Route("api/agency")]
[Authorize(Policy = "AgencyOnly")]
public sealed class AgencyController : ControllerBase
{
    private readonly LabourLinkDbContext _db;

    public AgencyController(LabourLinkDbContext db)
    {
        _db = db;
    }

    [HttpGet("profile")]
    [ProducesResponseType(typeof(AgencyProfileResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<AgencyProfileResponse>> GetProfile(CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var user = await _db.Users
            .Include(u => u.Agency)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return NotFound();
        }

        var agency = user.Agency;
        if (agency == null)
        {
            return Ok(new AgencyProfileResponse
            {
                UserId = user.UserId,
                AgencyId = Guid.Empty,
                Name = user.Email,
                ContactEmail = user.Email,
                ContactPhone = user.PhoneNumber,
                Status = VerificationStatus.Pending.ToString(),
            });
        }

        return Ok(new AgencyProfileResponse
        {
            UserId = user.UserId,
            AgencyId = agency.AgencyId,
            Name = agency.CompanyName,
            Description = agency.BusinessAddress,
            Website = agency.WebsiteUrl,
            ContactEmail = user.Email,
            ContactPhone = user.PhoneNumber,
            Address = agency.BusinessAddress,
            Status = agency.VerificationStatus.ToString(),
        });
    }

    [HttpPut("profile")]
    [ProducesResponseType(typeof(AgencyProfileResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<AgencyProfileResponse>> UpdateProfile(
        [FromBody] UpdateAgencyProfileRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var user = await _db.Users
            .Include(u => u.Agency)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(request.ContactEmail))
        {
            user.Email = request.ContactEmail.Trim().ToLowerInvariant();
        }

        if (!string.IsNullOrWhiteSpace(request.ContactPhone))
        {
            user.PhoneNumber = request.ContactPhone.Trim();
        }

        var agency = user.Agency;
        if (agency == null)
        {
            agency = new RecruitmentAgency
            {
                AgencyId = Guid.NewGuid(),
                UserId = user.UserId,
                CompanyName = request.Name ?? "",
                CompanyRegistrationNumber = request.CompanyRegistrationNumber ?? "",
                LicenseNumber = request.LicenseNumber ?? "",
                BusinessAddress = request.BusinessAddress ?? request.Address ?? "",
                TaxId = request.TaxId ?? "",
                BankAccount = request.BankAccount ?? "",
                VerificationStatus = VerificationStatus.Pending,
            };
            _db.RecruitmentAgencies.Add(agency);
        }
        else
        {
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                agency.CompanyName = request.Name;
            }

            if (!string.IsNullOrWhiteSpace(request.CompanyRegistrationNumber))
            {
                agency.CompanyRegistrationNumber = request.CompanyRegistrationNumber;
            }

            if (!string.IsNullOrWhiteSpace(request.LicenseNumber))
            {
                agency.LicenseNumber = request.LicenseNumber;
            }

            if (!string.IsNullOrWhiteSpace(request.BusinessAddress) || !string.IsNullOrWhiteSpace(request.Address))
            {
                agency.BusinessAddress = request.BusinessAddress ?? request.Address ?? agency.BusinessAddress;
            }

            if (!string.IsNullOrWhiteSpace(request.TaxId))
            {
                agency.TaxId = request.TaxId;
            }

            if (!string.IsNullOrWhiteSpace(request.BankAccount))
            {
                agency.BankAccount = request.BankAccount;
            }
        }

        if (!string.IsNullOrWhiteSpace(request.Website))
        {
            agency.WebsiteUrl = request.Website;
        }

        await _db.SaveChangesAsync(cancellationToken);
        return await GetProfile(cancellationToken);
    }

    [HttpPost("jobs")]
    [ProducesResponseType(typeof(JobPostingResponse), StatusCodes.Status201Created)]
    public async Task<ActionResult<JobPostingResponse>> CreateJob(
        [FromBody] CreateJobRequest request,
        CancellationToken cancellationToken = default)
    {
        var agency = await GetAgencyAsync(cancellationToken);
        if (agency == null)
        {
            return BadRequest(new MessageResponse { Message = "Agency profile not found" });
        }

        var job = new JobPosting
        {
            JobId = Guid.NewGuid(),
            AgencyId = agency.AgencyId,
            JobTitle = request.Title,
            JobDescription = request.Description,
            Location = request.Location,
            SalaryMin = request.SalaryMin,
            SalaryMax = request.SalaryMax,
            JobCategory = request.Category,
            EmploymentType = Enum.TryParse<EmploymentType>(request.EmploymentType, true, out var employment)
                ? employment
                : EmploymentType.FullTime,
            ApplicationDeadline = request.DeadlineDate.HasValue
                ? DateOnly.FromDateTime(request.DeadlineDate.Value)
                : null,
            Status = request.PublishNow ? JobStatus.Published : JobStatus.Draft,
            PostedAt = DateTime.UtcNow,
        };

        _db.JobPostings.Add(job);
        await _db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetJob), new { jobId = job.JobId }, new JobPostingResponse
        {
            JobId = job.JobId,
            Title = job.JobTitle,
            Status = job.Status.ToString(),
            ApplicationCount = 0,
            ViewCount = 0,
            PostedDate = job.PostedAt,
        });
    }

    [HttpPut("jobs/{jobId:guid}")]
    [ProducesResponseType(typeof(JobPostingDetailResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<JobPostingDetailResponse>> UpdateJob(
        Guid jobId,
        [FromBody] UpdateJobRequest request,
        CancellationToken cancellationToken = default)
    {
        var agency = await GetAgencyAsync(cancellationToken);
        if (agency == null)
        {
            return BadRequest(new MessageResponse { Message = "Agency profile not found" });
        }

        var job = await _db.JobPostings
            .FirstOrDefaultAsync(j => j.JobId == jobId && j.AgencyId == agency.AgencyId, cancellationToken);

        if (job == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            job.JobTitle = request.Title;
        }

        if (!string.IsNullOrWhiteSpace(request.Description))
        {
            job.JobDescription = request.Description;
        }

        if (!string.IsNullOrWhiteSpace(request.Location))
        {
            job.Location = request.Location;
        }

        if (request.SalaryMin.HasValue)
        {
            job.SalaryMin = request.SalaryMin;
        }

        if (request.SalaryMax.HasValue)
        {
            job.SalaryMax = request.SalaryMax;
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            job.JobCategory = request.Category;
        }

        if (!string.IsNullOrWhiteSpace(request.EmploymentType) && Enum.TryParse<EmploymentType>(request.EmploymentType, true, out var employment))
        {
            job.EmploymentType = employment;
        }

        if (request.DeadlineDate.HasValue)
        {
            job.ApplicationDeadline = DateOnly.FromDateTime(request.DeadlineDate.Value);
        }

        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new JobPostingDetailResponse
        {
            JobId = job.JobId,
            Title = job.JobTitle,
            Description = job.JobDescription,
            Location = job.Location,
            SalaryMin = job.SalaryMin ?? 0,
            SalaryMax = job.SalaryMax ?? 0,
            Category = job.JobCategory ?? string.Empty,
            Status = job.Status.ToString(),
            ApplicationCount = job.ApplyCount,
            ViewCount = job.ViewCount,
            PostedDate = job.PostedAt,
        });
    }

    [HttpGet("jobs")]
    [ProducesResponseType(typeof(List<JobPostingResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<JobPostingResponse>>> GetJobs(CancellationToken cancellationToken = default)
    {
        var agency = await GetAgencyAsync(cancellationToken);
        if (agency == null)
        {
            return Ok(new List<JobPostingResponse>());
        }

        var jobs = await _db.JobPostings
            .AsNoTracking()
            .Where(j => j.AgencyId == agency.AgencyId)
            .OrderByDescending(j => j.PostedAt)
            .Select(j => new JobPostingResponse
            {
                JobId = j.JobId,
                Title = j.JobTitle,
                Status = j.Status.ToString(),
                ApplicationCount = j.ApplyCount,
                ViewCount = j.ViewCount,
                PostedDate = j.PostedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(jobs);
    }

    [HttpGet("jobs/{jobId:guid}")]
    [ProducesResponseType(typeof(JobPostingDetailResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<JobPostingDetailResponse>> GetJob(Guid jobId, CancellationToken cancellationToken = default)
    {
        var agency = await GetAgencyAsync(cancellationToken);
        if (agency == null)
        {
            return NotFound();
        }

        var job = await _db.JobPostings
            .AsNoTracking()
            .FirstOrDefaultAsync(j => j.JobId == jobId && j.AgencyId == agency.AgencyId, cancellationToken);

        if (job == null)
        {
            return NotFound();
        }

        return Ok(new JobPostingDetailResponse
        {
            JobId = job.JobId,
            Title = job.JobTitle,
            Description = job.JobDescription,
            Location = job.Location,
            SalaryMin = job.SalaryMin ?? 0,
            SalaryMax = job.SalaryMax ?? 0,
            Category = job.JobCategory ?? string.Empty,
            Status = job.Status.ToString(),
            ApplicationCount = job.ApplyCount,
            ViewCount = job.ViewCount,
            PostedDate = job.PostedAt,
        });
    }

    [HttpGet("jobs/{jobId:guid}/applications")]
    [ProducesResponseType(typeof(List<ApplicationWithApplicantResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ApplicationWithApplicantResponse>>> GetApplications(Guid jobId, CancellationToken cancellationToken = default)
    {
        var agency = await GetAgencyAsync(cancellationToken);
        if (agency == null)
        {
            return Ok(new List<ApplicationWithApplicantResponse>());
        }

        var applications = await _db.JobApplications
            .AsNoTracking()
            .Include(a => a.Job)
            .Include(a => a.JobSeeker)
            .ThenInclude(js => js.User)
            .Where(a => a.JobId == jobId && a.Job!.AgencyId == agency.AgencyId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync(cancellationToken);

        var response = applications.Select(a => new ApplicationWithApplicantResponse
        {
            ApplicationId = a.ApplicationId,
            Status = a.Status.ToString(),
            AppliedDate = a.AppliedAt,
            JobTitle = a.Job?.JobTitle ?? string.Empty,
            Applicant = new ApplicantPreviewResponse
            {
                UserId = a.JobSeeker?.UserId ?? Guid.Empty,
                FullName = a.JobSeeker?.User == null
                    ? string.Empty
                    : $"{a.JobSeeker.User.FirstName} {a.JobSeeker.User.LastName}".Trim(),
                Email = a.JobSeeker?.User?.Email ?? string.Empty,
                PhoneNumber = a.JobSeeker?.User?.PhoneNumber,
            },
        }).ToList();

        return Ok(response);
    }

    [HttpPut("applications/{applicationId:guid}")]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<MessageResponse>> UpdateApplicationStatus(
        Guid applicationId,
        [FromBody] UpdateApplicationStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        var agency = await GetAgencyAsync(cancellationToken);
        if (agency == null)
        {
            return BadRequest(new MessageResponse { Message = "Agency profile not found" });
        }

        var application = await _db.JobApplications
            .Include(a => a.Job)
            .FirstOrDefaultAsync(a => a.ApplicationId == applicationId && a.Job!.AgencyId == agency.AgencyId, cancellationToken);

        if (application == null)
        {
            return NotFound();
        }

        if (!Enum.TryParse<ApplicationStatus>(request.Status, true, out var status))
        {
            return BadRequest(new MessageResponse { Message = "Invalid status" });
        }

        application.Status = status;
        application.RejectionReason = request.RejectionReason;
        application.ReviewedAt = DateTime.UtcNow;
        application.ReviewedBy = GetUserId();

        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new MessageResponse { Message = "Application updated" });
    }

    [HttpGet("statistics")]
    [ProducesResponseType(typeof(AgencyStatisticsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<AgencyStatisticsResponse>> GetStatistics(CancellationToken cancellationToken = default)
    {
        var agency = await GetAgencyAsync(cancellationToken);
        if (agency == null)
        {
            return Ok(new AgencyStatisticsResponse());
        }

        var jobs = await _db.JobPostings
            .AsNoTracking()
            .Where(j => j.AgencyId == agency.AgencyId)
            .ToListAsync(cancellationToken);

        var totalApplications = await _db.JobApplications
            .AsNoTracking()
            .CountAsync(a => a.Job!.AgencyId == agency.AgencyId, cancellationToken);

        return Ok(new AgencyStatisticsResponse
        {
            TotalJobs = jobs.Count,
            TotalApplications = totalApplications,
            TotalViewCount = jobs.Sum(j => j.ViewCount),
            ApprovedJobs = jobs.Count(j => j.Status == JobStatus.Published),
            DraftJobs = jobs.Count(j => j.Status == JobStatus.Draft),
        });
    }

    private async Task<RecruitmentAgency?> GetAgencyAsync(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        return await _db.RecruitmentAgencies.FirstOrDefaultAsync(a => a.UserId == userId, cancellationToken);
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId) || !Guid.TryParse(userId, out var id))
        {
            throw new UnauthorizedAccessException("Invalid user");
        }

        return id;
    }
}
