using LabourLinkAPI.Contracts.JobSeeker;
using LabourLinkAPI.Data;
using LabourLinkAPI.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabourLinkAPI.Controllers;

[ApiController]
[Route("api/jobs")]
[AllowAnonymous]
public sealed class JobsController : ControllerBase
{
    private readonly LabourLinkDbContext _db;

    public JobsController(LabourLinkDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<JobSearchResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<JobSearchResponse>>> GetJobs(
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

    [HttpGet("{jobId:guid}")]
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

        job.ViewCount += 1;
        await _db.SaveChangesAsync(cancellationToken);

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
}
