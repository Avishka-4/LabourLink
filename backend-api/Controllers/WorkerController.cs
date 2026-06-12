using System.Security.Claims;
using LabourLinkAPI.Contracts.Auth;
using LabourLinkAPI.Contracts.JobSeeker;
using LabourLinkAPI.Contracts.Worker;
using LabourLinkAPI.Data;
using LabourLinkAPI.Models.Entities;
using LabourLinkAPI.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabourLinkAPI.Controllers;

[ApiController]
[Route("api/worker")]
[Authorize(Policy = "WorkerOnly")]
public sealed class WorkerController : ControllerBase
{
    private readonly LabourLinkDbContext _db;

    public WorkerController(LabourLinkDbContext db)
    {
        _db = db;
    }

    [HttpGet("profile")]
    [ProducesResponseType(typeof(WorkerProfileResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<WorkerProfileResponse>> GetProfile(CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var user = await _db.Users
            .Include(u => u.Worker)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return NotFound();
        }

        var worker = user.Worker;
        if (worker == null)
        {
            return Ok(new WorkerProfileResponse
            {
                UserId = user.UserId,
                WorkerId = Guid.Empty,
                FullName = $"{user.FirstName} {user.LastName}".Trim(),
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Status = user.Status.ToString(),
            });
        }

        return Ok(new WorkerProfileResponse
        {
            UserId = user.UserId,
            WorkerId = worker.WorkerId,
            FullName = $"{user.FirstName} {user.LastName}".Trim(),
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Nationality = worker.Nationality,
            Skills = string.Join(", ", worker.Skills),
            Location = worker.CurrentLocation,
            Experience = worker.YearsOfExperience,
            Education = worker.DesiredLocation,
            Status = worker.VerificationStatus.ToString(),
        });
    }

    [HttpPut("profile")]
    [ProducesResponseType(typeof(WorkerProfileResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<WorkerProfileResponse>> UpdateProfile(
        [FromBody] UpdateWorkerProfileRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var user = await _db.Users
            .Include(u => u.Worker)
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

        var worker = user.Worker;
        if (worker == null)
        {
            worker = new Worker
            {
                WorkerId = Guid.NewGuid(),
                UserId = user.UserId,
                WorkerRegistrationNumber = Guid.NewGuid().ToString("N")[..8],
                Nationality = request.Nationality ?? "Unknown",
                PassportNumber = Guid.NewGuid().ToString("N")[..12],
                DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-18)),
                Gender = Gender.Other,
                CurrentLocation = request.Location ?? "Unknown",
                EmergencyContactName = "Unknown",
                EmergencyContactPhone = "Unknown",
                YearsOfExperience = request.Experience ?? 0,
            };
            _db.Workers.Add(worker);
        }
        else
        {
            if (!string.IsNullOrWhiteSpace(request.Nationality))
                worker.Nationality = request.Nationality;

            if (!string.IsNullOrWhiteSpace(request.Location))
                worker.CurrentLocation = request.Location;

            if (request.Experience.HasValue)
                worker.YearsOfExperience = request.Experience.Value;

            if (!string.IsNullOrWhiteSpace(request.Education))
                worker.DesiredLocation = request.Education;
        }

        if (!string.IsNullOrWhiteSpace(request.Skills))
        {
            worker.Skills = request.Skills.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(skill => skill.Trim())
                .Where(skill => !string.IsNullOrWhiteSpace(skill))
                .ToList();
        }

        await _db.SaveChangesAsync(cancellationToken);

        return await GetProfile(cancellationToken);
    }

    [HttpPost("complaints")]
    [ProducesResponseType(typeof(ComplaintResponse), StatusCodes.Status201Created)]
    public async Task<ActionResult<ComplaintResponse>> CreateComplaint(
        [FromBody] CreateComplaintRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var worker = await _db.Workers.FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);
        if (worker == null)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);
            if (user == null) return NotFound();

            worker = new Worker
            {
                WorkerId = Guid.NewGuid(),
                UserId = userId,
                WorkerRegistrationNumber = Guid.NewGuid().ToString("N")[..8],
                Nationality = "Unknown",
                PassportNumber = Guid.NewGuid().ToString("N")[..12],
                DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-18)),
                Gender = Gender.Other,
                CurrentLocation = "Unknown",
                EmergencyContactName = "Unknown",
                EmergencyContactPhone = "Unknown",
            };
            _db.Workers.Add(worker);
        }

        var complaint = new WorkerComplaint
        {
            ComplaintId = Guid.NewGuid(),
            WorkerId = worker.WorkerId,
            ComplaintType = Enum.TryParse<ComplaintType>(request.Type, true, out var type)
                ? type
                : ComplaintType.Other,
            Title = request.Title,
            Description = request.Description,
            AttachmentUrl = request.AttachmentUrl,
            TargetAgencyName = request.TargetAgencyName?.Trim(),
            Status = ComplaintStatus.Submitted,
            Priority = Priority.Medium,
            SubmittedAt = DateTime.UtcNow,
        };

        _db.WorkerComplaints.Add(complaint);
        await _db.SaveChangesAsync(cancellationToken);

        var response = new ComplaintResponse
        {
            ComplaintId = complaint.ComplaintId,
            Title = complaint.Title,
            Type = complaint.ComplaintType.ToString(),
            Status = complaint.Status.ToString(),
            CreatedAt = complaint.CreatedAt,
        };

        return CreatedAtAction(nameof(GetComplaint), new { complaintId = complaint.ComplaintId }, response);
    }

    [HttpGet("complaints")]
    [ProducesResponseType(typeof(List<ComplaintResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ComplaintResponse>>> GetComplaints(CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var worker = await _db.Workers.FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);
        if (worker == null)
        {
            return Ok(new List<ComplaintResponse>());
        }

        var complaints = await _db.WorkerComplaints
            .AsNoTracking()
            .Where(c => c.WorkerId == worker.WorkerId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ComplaintResponse
            {
                ComplaintId = c.ComplaintId,
                Title = c.Title,
                Type = c.ComplaintType.ToString(),
                Status = c.Status.ToString(),
                ResolutionNotes = c.ResolutionNotes,
                TargetAgencyName = c.TargetAgencyName,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(complaints);
    }

    [HttpGet("complaints/{complaintId:guid}")]
    [ProducesResponseType(typeof(ComplaintDetailResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ComplaintDetailResponse>> GetComplaint(Guid complaintId, CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var worker = await _db.Workers.FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);
        if (worker == null)
        {
            return NotFound();
        }

        var complaint = await _db.WorkerComplaints
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.WorkerId == worker.WorkerId && c.ComplaintId == complaintId, cancellationToken);

        if (complaint == null)
        {
            return NotFound();
        }

        return Ok(new ComplaintDetailResponse
        {
            ComplaintId = complaint.ComplaintId,
            Title = complaint.Title,
            Type = complaint.ComplaintType.ToString(),
            Description = complaint.Description,
            Status = complaint.Status.ToString(),
            AttachmentUrl = complaint.AttachmentUrl,
            ResolutionNotes = complaint.ResolutionNotes,
            WorkerRating = complaint.WorkerRating,
            CreatedAt = complaint.CreatedAt,
            UpdatedAt = complaint.UpdatedAt,
            History = new List<ComplaintUpdateHistory>(),
        });
    }

    [HttpPut("complaints/{complaintId:guid}/respond")]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<MessageResponse>> RespondToComplaint(
        Guid complaintId,
        [FromBody] WorkerRespondComplaintRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var worker = await _db.Workers.FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);
        if (worker == null)
        {
            return NotFound();
        }

        var complaint = await _db.WorkerComplaints
            .FirstOrDefaultAsync(c => c.WorkerId == worker.WorkerId && c.ComplaintId == complaintId, cancellationToken);

        if (complaint == null)
        {
            return NotFound();
        }

        var action = request.Action.Trim().ToLowerInvariant();
        if (action == "satisfied")
        {
            complaint.Status = ComplaintStatus.Closed;
            complaint.WorkerRating = 5;
        }
        else if (action == "reopen")
        {
            complaint.Status = ComplaintStatus.InProgress;
            complaint.ResolutionNotes = null;
            complaint.ResolvedAt = null;
            complaint.WorkerRating = 1;
        }
        else
        {
            return BadRequest(new MessageResponse { Message = "Invalid action. Use 'satisfied' or 'reopen'" });
        }

        complaint.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new MessageResponse { Message = action == "satisfied" ? "Complaint closed" : "Complaint reopened" });
    }

    [HttpPut("complaints/{complaintId:guid}")]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<MessageResponse>> UpdateComplaint(
        Guid complaintId,
        [FromBody] UpdateComplaintRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var worker = await _db.Workers.FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);
        if (worker == null)
        {
            return NotFound();
        }

        var complaint = await _db.WorkerComplaints
            .FirstOrDefaultAsync(c => c.WorkerId == worker.WorkerId && c.ComplaintId == complaintId, cancellationToken);

        if (complaint == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(request.UpdateNotes))
        {
            complaint.ResolutionNotes = request.UpdateNotes;
            complaint.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new MessageResponse { Message = "Complaint updated" });
    }

    [HttpGet("jobs")]
    [ProducesResponseType(typeof(List<JobSearchResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<JobSearchResponse>>> BrowseJobs(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? location,
        CancellationToken cancellationToken = default)
    {
        var query = _db.JobPostings
            .AsNoTracking()
            .Include(j => j.Agency)
            .Where(j => j.Status == JobStatus.Published);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(j => j.JobTitle.Contains(search) || j.JobDescription.Contains(search));

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(j => j.JobCategory == category);

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(j => j.Location.Contains(location));

        var jobs = await query
            .OrderByDescending(j => j.PostedAt)
            .Select(j => new JobSearchResponse
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
                },
            })
            .ToListAsync(cancellationToken);

        return Ok(jobs);
    }

    [HttpGet("jobs/{jobId:guid}")]
    [ProducesResponseType(typeof(JobDetailResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<JobDetailResponse>> GetJobDetail(Guid jobId, CancellationToken cancellationToken = default)
    {
        var job = await _db.JobPostings
            .AsNoTracking()
            .Include(j => j.Agency)
            .ThenInclude(a => a!.User)
            .FirstOrDefaultAsync(j => j.JobId == jobId && j.Status == JobStatus.Published, cancellationToken);

        if (job == null)
            return NotFound();

        job.ViewCount++;
        await _db.JobPostings
            .Where(j => j.JobId == jobId)
            .ExecuteUpdateAsync(s => s.SetProperty(j => j.ViewCount, j => j.ViewCount + 1), cancellationToken);

        return Ok(new JobDetailResponse
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
            DeadlineDate = job.ApplicationDeadline.HasValue
                ? job.ApplicationDeadline.Value.ToDateTime(TimeOnly.MinValue)
                : null,
            ApplicationCount = job.ApplyCount,
            Agency = new AgencyDetailResponse
            {
                AgencyId = job.Agency?.AgencyId ?? Guid.Empty,
                Name = job.Agency?.CompanyName ?? string.Empty,
                Description = job.Agency?.BusinessAddress,
                Website = job.Agency?.WebsiteUrl,
                Email = job.Agency?.User?.Email,
                PhoneNumber = job.Agency?.User?.PhoneNumber,
            },
        });
    }

    [HttpPost("jobs/{jobId:guid}/apply")]
    [ProducesResponseType(typeof(JobApplicationResponse), StatusCodes.Status201Created)]
    public async Task<ActionResult<JobApplicationResponse>> ApplyForJob(
        Guid jobId,
        [FromBody] JobApplicationRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var worker = await _db.Workers.FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);
        if (worker == null)
            return NotFound(new MessageResponse { Message = "Worker profile not found" });

        var job = await _db.JobPostings
            .FirstOrDefaultAsync(j => j.JobId == jobId && j.Status == JobStatus.Published, cancellationToken);
        if (job == null)
            return NotFound(new MessageResponse { Message = "Job not found" });

        var existing = await _db.JobApplications
            .FirstOrDefaultAsync(a => a.JobId == jobId && a.WorkerId == worker.WorkerId, cancellationToken);
        if (existing != null)
            return Conflict(new MessageResponse { Message = "You have already applied for this job" });

        var application = new JobApplication
        {
            ApplicationId = Guid.NewGuid(),
            JobId = jobId,
            WorkerId = worker.WorkerId,
            JobSeekerId = null,
            CoverLetter = request.CoverLetter,
            ResumeUrl = request.ResumeUrl,
            Status = ApplicationStatus.Pending,
            AppliedAt = DateTime.UtcNow,
        };

        job.ApplyCount++;
        _db.JobApplications.Add(application);
        await _db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetJobDetail), new { jobId }, new JobApplicationResponse
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
        var worker = await _db.Workers.FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);
        if (worker == null)
            return Ok(new List<JobApplicationListResponse>());

        var applications = await _db.JobApplications
            .AsNoTracking()
            .Include(a => a.Job)
            .ThenInclude(j => j!.Agency)
            .Where(a => a.WorkerId == worker.WorkerId)
            .OrderByDescending(a => a.AppliedAt)
            .Select(a => new JobApplicationListResponse
            {
                ApplicationId = a.ApplicationId,
                JobTitle = a.Job != null ? a.Job.JobTitle : string.Empty,
                Status = a.Status.ToString(),
                AppliedDate = a.AppliedAt,
                ResponseDate = a.ReviewedAt,
                AgencyName = a.Job != null && a.Job.Agency != null ? a.Job.Agency.CompanyName : null,
            })
            .ToListAsync(cancellationToken);

        return Ok(applications);
    }

    [HttpGet("agencies")]
    [ProducesResponseType(typeof(List<AgencyListItem>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<AgencyListItem>>> GetAgencies(CancellationToken cancellationToken = default)
    {
        var agencies = await _db.RecruitmentAgencies
            .AsNoTracking()
            .OrderBy(a => a.CompanyName)
            .Select(a => new AgencyListItem
            {
                AgencyId = a.AgencyId,
                CompanyName = a.CompanyName,
            })
            .ToListAsync(cancellationToken);

        return Ok(agencies);
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
