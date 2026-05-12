using System.Security.Claims;
using LabourLinkAPI.Contracts.Auth;
using LabourLinkAPI.Contracts.JobSeeker;
using LabourLinkAPI.Data;
using LabourLinkAPI.Models.Entities;
using LabourLinkAPI.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabourLinkAPI.Controllers;

[ApiController]
[Route("api/jobseeker")]
[Authorize(Policy = "JobSeekerOnly")]
public sealed class JobSeekerController : ControllerBase
{
    private readonly LabourLinkDbContext _db;

    public JobSeekerController(LabourLinkDbContext db)
    {
        _db = db;
    }

    [HttpGet("profile")]
    [ProducesResponseType(typeof(JobSeekerProfileResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<JobSeekerProfileResponse>> GetProfile(CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var user = await _db.Users
            .Include(u => u.JobSeeker)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return NotFound();
        }

        var seeker = user.JobSeeker;
        if (seeker == null)
        {
            return Ok(new JobSeekerProfileResponse
            {
                UserId = user.UserId,
                JobSeekerId = Guid.Empty,
                FullName = $"{user.FirstName} {user.LastName}".Trim(),
                Email = user.Email,
            });
        }

        return Ok(new JobSeekerProfileResponse
        {
            UserId = user.UserId,
            JobSeekerId = seeker.JobSeekerId,
            FullName = $"{user.FirstName} {user.LastName}".Trim(),
            Email = user.Email,
            Education = seeker.EducationLevel.ToString(),
            Qualifications = seeker.Qualification,
            Languages = string.Join(", ", seeker.Languages),
            Location = seeker.DesiredLocation,
            Resume = null,
        });
    }

    [HttpPut("profile")]
    [ProducesResponseType(typeof(JobSeekerProfileResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<JobSeekerProfileResponse>> UpdateProfile(
        [FromBody] UpdateJobSeekerProfileRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var user = await _db.Users
            .Include(u => u.JobSeeker)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(request.FirstName))
        {
            user.FirstName = request.FirstName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.LastName))
        {
            user.LastName = request.LastName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            user.Email = request.Email.Trim().ToLowerInvariant();
        }

        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            user.PhoneNumber = request.PhoneNumber.Trim();
        }

        var seeker = user.JobSeeker;
        if (seeker == null)
        {
            seeker = new JobSeeker
            {
                JobSeekerId = Guid.NewGuid(),
                UserId = user.UserId,
                EducationLevel = Enum.TryParse<EducationLevel>(request.Education, true, out var level)
                    ? level
                    : EducationLevel.Secondary,
                Qualification = request.Qualifications ?? "",
                DesiredJobRole = request.DesiredJobRole ?? "",
                DesiredLocation = request.DesiredLocation ?? request.Location ?? "",
            };
            _db.JobSeekers.Add(seeker);
        }
        else
        {
            if (!string.IsNullOrWhiteSpace(request.Qualifications))
            {
                seeker.Qualification = request.Qualifications;
            }

            if (!string.IsNullOrWhiteSpace(request.DesiredJobRole))
            {
                seeker.DesiredJobRole = request.DesiredJobRole;
            }

            if (!string.IsNullOrWhiteSpace(request.DesiredLocation) || !string.IsNullOrWhiteSpace(request.Location))
            {
                seeker.DesiredLocation = request.DesiredLocation ?? request.Location ?? seeker.DesiredLocation;
            }

            if (!string.IsNullOrWhiteSpace(request.Education) && Enum.TryParse<EducationLevel>(request.Education, true, out var eduLevel))
            {
                seeker.EducationLevel = eduLevel;
            }
        }

        if (!string.IsNullOrWhiteSpace(request.Languages))
        {
            seeker.Languages = request.Languages.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(lang => lang.Trim())
                .Where(lang => !string.IsNullOrWhiteSpace(lang))
                .ToList();
        }

        await _db.SaveChangesAsync(cancellationToken);

        return await GetProfile(cancellationToken);
    }

    [HttpGet("jobs")]
    [ProducesResponseType(typeof(List<JobSearchResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<JobSearchResponse>>> SearchJobs(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize is < 1 or > 100 ? 20 : pageSize;

        var query = _db.JobPostings
            .AsNoTracking()
            .Include(j => j.Agency)
            .Where(j => j.Status == JobStatus.Published);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(j =>
                j.JobTitle.ToLower().Contains(term) ||
                j.JobDescription.ToLower().Contains(term) ||
                (j.JobCategory ?? string.Empty).ToLower().Contains(term));
        }

        var jobs = await query
            .OrderByDescending(j => j.PostedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var response = jobs.Select(j => new JobSearchResponse
        {
            JobId = j.JobId,
            Title = j.JobTitle,
            Description = j.JobDescription,
            Location = j.Location,
            SalaryMin = j.SalaryMin,
            SalaryMax = j.SalaryMax,
            Category = j.JobCategory,
            EmploymentType = j.EmploymentType.ToString(),
            PostedDate = j.PostedAt,
            ViewCount = j.ViewCount,
            Agency = j.Agency == null ? null : new AgencySummaryResponse
            {
                AgencyId = j.Agency.AgencyId,
                Name = j.Agency.CompanyName,
                Logo = j.Agency.User?.ProfileImageUrl,
            },
        }).ToList();

        return Ok(response);
    }

    [HttpGet("jobs/{jobId:guid}")]
    [ProducesResponseType(typeof(JobDetailResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<JobDetailResponse>> GetJob(Guid jobId, CancellationToken cancellationToken = default)
    {
        var job = await _db.JobPostings
            .Include(j => j.Agency)
            .ThenInclude(a => a.User)
            .Include(j => j.Applications)
            .FirstOrDefaultAsync(j => j.JobId == jobId && j.Status == JobStatus.Published, cancellationToken);

        if (job == null)
        {
            return NotFound();
        }

        var response = new JobDetailResponse
        {
            JobId = job.JobId,
            Title = job.JobTitle,
            Description = job.JobDescription,
            Location = job.Location,
            SalaryMin = job.SalaryMin ?? 0,
            SalaryMax = job.SalaryMax ?? 0,
            Category = job.JobCategory ?? string.Empty,
            EmploymentType = job.EmploymentType.ToString(),
            ViewCount = job.ViewCount,
            PostedDate = job.PostedAt,
            DeadlineDate = job.ApplicationDeadline?.ToDateTime(TimeOnly.MinValue),
            ApplicationCount = job.Applications.Count,
            Agency = new AgencyDetailResponse
            {
                AgencyId = job.Agency?.AgencyId ?? Guid.Empty,
                Name = job.Agency?.CompanyName ?? string.Empty,
                Description = job.Agency?.BusinessAddress,
                Logo = job.Agency?.User?.ProfileImageUrl,
                Website = job.Agency?.WebsiteUrl,
                Email = job.Agency?.User?.Email,
                PhoneNumber = job.Agency?.User?.PhoneNumber,
            },
        };

        return Ok(response);
    }

    [HttpPost("jobs/{jobId:guid}/apply")]
    [ProducesResponseType(typeof(JobApplicationResponse), StatusCodes.Status201Created)]
    public async Task<ActionResult<JobApplicationResponse>> ApplyToJob(
        Guid jobId,
        [FromBody] JobApplicationRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var seeker = await _db.JobSeekers.FirstOrDefaultAsync(j => j.UserId == userId, cancellationToken);
        if (seeker == null)
        {
            return BadRequest(new MessageResponse { Message = "Job seeker profile not found" });
        }

        var job = await _db.JobPostings.FirstOrDefaultAsync(j => j.JobId == jobId && j.Status == JobStatus.Published, cancellationToken);
        if (job == null)
        {
            return NotFound();
        }

        var existing = await _db.JobApplications
            .FirstOrDefaultAsync(a => a.JobId == jobId && a.JobSeekerId == seeker.JobSeekerId, cancellationToken);
        if (existing != null)
        {
            return BadRequest(new MessageResponse { Message = "Already applied" });
        }

        var application = new JobApplication
        {
            ApplicationId = Guid.NewGuid(),
            JobId = jobId,
            JobSeekerId = seeker.JobSeekerId,
            Status = ApplicationStatus.Pending,
            CoverLetter = request.CoverLetter,
            ResumeUrl = request.ResumeUrl,
            AppliedAt = DateTime.UtcNow,
        };

        _db.JobApplications.Add(application);
        job.ApplyCount += 1;
        await _db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetApplication), new { applicationId = application.ApplicationId }, new JobApplicationResponse
        {
            ApplicationId = application.ApplicationId,
            Status = application.Status.ToString(),
            AppliedDate = application.AppliedAt,
        });
    }

    [HttpGet("applications")]
    [ProducesResponseType(typeof(List<JobApplicationListResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<JobApplicationListResponse>>> GetApplications(CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var seeker = await _db.JobSeekers.FirstOrDefaultAsync(j => j.UserId == userId, cancellationToken);
        if (seeker == null)
        {
            return Ok(new List<JobApplicationListResponse>());
        }

        var applications = await _db.JobApplications
            .AsNoTracking()
            .Include(a => a.Job)
            .ThenInclude(j => j.Agency)
            .Where(a => a.JobSeekerId == seeker.JobSeekerId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync(cancellationToken);

        var response = applications.Select(a => new JobApplicationListResponse
        {
            ApplicationId = a.ApplicationId,
            JobTitle = a.Job?.JobTitle ?? string.Empty,
            Status = a.Status.ToString(),
            AppliedDate = a.AppliedAt,
            ResponseDate = a.ReviewedAt,
            AgencyName = a.Job?.Agency?.CompanyName,
        }).ToList();

        return Ok(response);
    }

    [HttpGet("applications/{applicationId:guid}")]
    [ProducesResponseType(typeof(JobApplicationDetailResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<JobApplicationDetailResponse>> GetApplication(Guid applicationId, CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var seeker = await _db.JobSeekers.FirstOrDefaultAsync(j => j.UserId == userId, cancellationToken);
        if (seeker == null)
        {
            return NotFound();
        }

        var application = await _db.JobApplications
            .AsNoTracking()
            .Include(a => a.Job)
            .ThenInclude(j => j.Agency)
            .FirstOrDefaultAsync(a => a.ApplicationId == applicationId && a.JobSeekerId == seeker.JobSeekerId, cancellationToken);

        if (application == null)
        {
            return NotFound();
        }

        return Ok(new JobApplicationDetailResponse
        {
            ApplicationId = application.ApplicationId,
            Status = application.Status.ToString(),
            CoverLetter = application.CoverLetter,
            ResumeUrl = application.ResumeUrl,
            AppliedDate = application.AppliedAt,
            ResponseDate = application.ReviewedAt,
            RejectionReason = application.RejectionReason,
            Job = new JobDetailResponse
            {
                JobId = application.Job?.JobId ?? Guid.Empty,
                Title = application.Job?.JobTitle ?? string.Empty,
                Description = application.Job?.JobDescription ?? string.Empty,
                Location = application.Job?.Location ?? string.Empty,
                SalaryMin = application.Job?.SalaryMin ?? 0,
                SalaryMax = application.Job?.SalaryMax ?? 0,
                Category = application.Job?.JobCategory ?? string.Empty,
                EmploymentType = application.Job?.EmploymentType.ToString() ?? string.Empty,
                ViewCount = application.Job?.ViewCount ?? 0,
                PostedDate = application.Job?.PostedAt ?? DateTime.UtcNow,
                DeadlineDate = application.Job?.ApplicationDeadline?.ToDateTime(TimeOnly.MinValue),
                ApplicationCount = application.Job?.Applications.Count ?? 0,
                Agency = new AgencyDetailResponse
                {
                    AgencyId = application.Job?.Agency?.AgencyId ?? Guid.Empty,
                    Name = application.Job?.Agency?.CompanyName ?? string.Empty,
                    Description = application.Job?.Agency?.BusinessAddress,
                    Logo = application.Job?.Agency?.User?.ProfileImageUrl,
                    Website = application.Job?.Agency?.WebsiteUrl,
                    Email = application.Job?.Agency?.User?.Email,
                    PhoneNumber = application.Job?.Agency?.User?.PhoneNumber,
                },
            },
        });
    }

    [HttpPost("saved-jobs")]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<MessageResponse>> SaveJob(
        [FromBody] SaveJobRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var seeker = await _db.JobSeekers.FirstOrDefaultAsync(j => j.UserId == userId, cancellationToken);
        if (seeker == null)
        {
            return BadRequest(new MessageResponse { Message = "Job seeker profile not found" });
        }

        var exists = await _db.SavedJobs
            .AnyAsync(s => s.JobSeekerId == seeker.JobSeekerId && s.JobId == request.JobId, cancellationToken);

        if (exists)
        {
            return Ok(new MessageResponse { Message = "Already saved" });
        }

        _db.SavedJobs.Add(new SavedJob
        {
            SavedJobId = Guid.NewGuid(),
            JobSeekerId = seeker.JobSeekerId,
            JobId = request.JobId,
        });

        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new MessageResponse { Message = "Job saved" });
    }

    [HttpGet("saved-jobs")]
    [ProducesResponseType(typeof(List<SavedJobResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<SavedJobResponse>>> GetSavedJobs(CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var seeker = await _db.JobSeekers.FirstOrDefaultAsync(j => j.UserId == userId, cancellationToken);
        if (seeker == null)
        {
            return Ok(new List<SavedJobResponse>());
        }

        var savedJobs = await _db.SavedJobs
            .AsNoTracking()
            .Include(s => s.Job)
            .Where(s => s.JobSeekerId == seeker.JobSeekerId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);

        var response = savedJobs.Select(s => new SavedJobResponse
        {
            JobId = s.JobId,
            Title = s.Job?.JobTitle ?? string.Empty,
            Location = s.Job?.Location,
            SalaryMin = s.Job?.SalaryMin,
            SalaryMax = s.Job?.SalaryMax,
            SavedDate = s.CreatedAt,
            PostedDate = s.Job?.PostedAt ?? DateTime.UtcNow,
        }).ToList();

        return Ok(response);
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
