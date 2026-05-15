using System.Security.Claims;
using LabourLinkAPI.Contracts.Admin;
using LabourLinkAPI.Contracts.Auth;
using LabourLinkAPI.Data;
using LabourLinkAPI.Models.Entities;
using LabourLinkAPI.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabourLinkAPI.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Policy = "AdminOnly")]
public sealed class AdminController : ControllerBase
{
    private readonly LabourLinkDbContext _db;

    public AdminController(LabourLinkDbContext db)
    {
        _db = db;
    }

    [HttpGet("users")]
    [ProducesResponseType(typeof(List<UserListResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<UserListResponse>>> GetUsers(CancellationToken cancellationToken = default)
    {
        var users = await _db.Users
            .AsNoTracking()
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserListResponse
            {
                UserId = u.UserId,
                FullName = $"{u.FirstName} {u.LastName}".Trim(),
                Email = u.Email,
                Role = u.Role.ToString(),
                Status = u.Status.ToString(),
                CreatedAt = u.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(users);
    }

    [HttpGet("users/{userId:guid}")]
    [ProducesResponseType(typeof(UserDetailResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<UserDetailResponse>> GetUser(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(new UserDetailResponse
        {
            UserId = user.UserId,
            FullName = $"{user.FirstName} {user.LastName}".Trim(),
            Email = user.Email,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Role = user.Role.ToString(),
            Status = user.Status.ToString(),
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt,
        });
    }

    [HttpPut("users/{userId:guid}/status")]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<MessageResponse>> UpdateUserStatus(
        Guid userId,
        [FromBody] UpdateUserStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);
        if (user == null)
        {
            return NotFound();
        }

        if (!Enum.TryParse<UserStatus>(request.Status, true, out var status))
        {
            return BadRequest(new MessageResponse { Message = "Invalid status" });
        }

        user.Status = status;
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new MessageResponse { Message = "User status updated" });
    }

    [HttpGet("verifications")]
    [ProducesResponseType(typeof(List<PendingVerificationResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<PendingVerificationResponse>>> GetPendingVerifications(CancellationToken cancellationToken = default)
    {
        var workers = await _db.Workers
            .AsNoTracking()
            .Include(w => w.User)
            .Where(w => w.VerificationStatus == VerificationStatus.Pending)
            .Select(w => new PendingVerificationResponse
            {
                Id = w.WorkerId,
                Name = w.User == null ? "" : $"{w.User.FirstName} {w.User.LastName}".Trim(),
                Email = w.User?.Email ?? string.Empty,
                SubmittedAt = w.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        var agencies = await _db.RecruitmentAgencies
            .AsNoTracking()
            .Include(a => a.User)
            .Where(a => a.VerificationStatus == VerificationStatus.Pending)
            .Select(a => new PendingVerificationResponse
            {
                Id = a.AgencyId,
                Name = a.CompanyName,
                Email = a.User?.Email ?? string.Empty,
                SubmittedAt = a.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        var combined = workers.Concat(agencies).OrderByDescending(x => x.SubmittedAt).ToList();
        return Ok(combined);
    }

    [HttpPut("verifications/{verificationId:guid}")]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<MessageResponse>> ReviewVerification(
        Guid verificationId,
        [FromBody] VerificationRequest request,
        CancellationToken cancellationToken = default)
    {
        var worker = await _db.Workers.FirstOrDefaultAsync(w => w.WorkerId == verificationId, cancellationToken);
        if (worker != null)
        {
            worker.VerificationStatus = request.IsApproved ? VerificationStatus.Verified : VerificationStatus.Rejected;
            worker.VerifiedAt = DateTime.UtcNow;
            worker.VerifiedBy = GetUserId();
            await _db.SaveChangesAsync(cancellationToken);
            return Ok(new MessageResponse { Message = "Worker verification updated" });
        }

        var agency = await _db.RecruitmentAgencies.FirstOrDefaultAsync(a => a.AgencyId == verificationId, cancellationToken);
        if (agency == null)
        {
            return NotFound();
        }

        agency.VerificationStatus = request.IsApproved ? VerificationStatus.Verified : VerificationStatus.Rejected;
        agency.VerifiedAt = DateTime.UtcNow;
        agency.VerifiedBy = GetUserId();
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new MessageResponse { Message = "Agency verification updated" });
    }

    [HttpGet("jobs/pending")]
    [ProducesResponseType(typeof(List<PendingJobResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<PendingJobResponse>>> GetPendingJobs(CancellationToken cancellationToken = default)
    {
        var jobs = await _db.JobPostings
            .AsNoTracking()
            .Include(j => j.Agency)
            .Where(j => j.Status == JobStatus.Draft)
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => new PendingJobResponse
            {
                JobId = j.JobId,
                Title = j.JobTitle,
                AgencyName = j.Agency?.CompanyName ?? string.Empty,
                SubmittedAt = j.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(jobs);
    }

    [HttpPut("jobs/{jobId:guid}/approval")]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<MessageResponse>> ReviewJob(
        Guid jobId,
        [FromBody] ApprovalRequest request,
        CancellationToken cancellationToken = default)
    {
        var job = await _db.JobPostings.FirstOrDefaultAsync(j => j.JobId == jobId, cancellationToken);
        if (job == null)
        {
            return NotFound();
        }

        job.Status = request.IsApproved ? JobStatus.Published : JobStatus.Closed;
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new MessageResponse { Message = "Job approval updated" });
    }

    [HttpGet("complaints")]
    [ProducesResponseType(typeof(List<ComplaintListResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ComplaintListResponse>>> GetComplaints(CancellationToken cancellationToken = default)
    {
        var complaints = await _db.WorkerComplaints
            .AsNoTracking()
            .Include(c => c.Worker)
            .ThenInclude(w => w.User)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ComplaintListResponse
            {
                ComplaintId = c.ComplaintId,
                Type = c.ComplaintType.ToString(),
                Title = c.Title,
                Status = c.Status.ToString(),
                Priority = c.Priority.ToString(),
                CreatedAt = c.CreatedAt,
                WorkerName = c.Worker != null && c.Worker.User != null
                    ? $"{c.Worker.User.FirstName} {c.Worker.User.LastName}".Trim()
                    : null,
            })
            .ToListAsync(cancellationToken);

        return Ok(complaints);
    }

    [HttpPut("complaints/{complaintId:guid}/assign")]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<MessageResponse>> AssignComplaint(
        Guid complaintId,
        [FromBody] AssignComplaintRequest request,
        CancellationToken cancellationToken = default)
    {
        var complaint = await _db.WorkerComplaints.FirstOrDefaultAsync(c => c.ComplaintId == complaintId, cancellationToken);
        if (complaint == null)
        {
            return NotFound();
        }

        complaint.AssignedToAdminId = request.AssignedToAdminId;
        complaint.Status = ComplaintStatus.UnderReview;
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new MessageResponse { Message = "Complaint assigned" });
    }

    [HttpPut("complaints/{complaintId:guid}/status")]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<MessageResponse>> UpdateComplaintStatus(
        Guid complaintId,
        [FromBody] UpdateComplaintStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        var complaint = await _db.WorkerComplaints.FirstOrDefaultAsync(c => c.ComplaintId == complaintId, cancellationToken);
        if (complaint == null)
        {
            return NotFound();
        }

        if (!Enum.TryParse<ComplaintStatus>(request.Status, true, out var status))
        {
            return BadRequest(new MessageResponse { Message = "Invalid status" });
        }

        complaint.Status = status;
        complaint.ResolutionNotes = request.ResolutionNotes;
        if (status is ComplaintStatus.Resolved or ComplaintStatus.Closed)
        {
            complaint.ResolvedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(cancellationToken);
        return Ok(new MessageResponse { Message = "Complaint status updated" });
    }

    [HttpGet("news")]
    [ProducesResponseType(typeof(List<NewsResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<NewsResponse>>> GetNews(CancellationToken cancellationToken = default)
    {
        var newsItems = await _db.News
            .AsNoTracking()
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NewsResponse
            {
                NewsId = n.NewsId,
                Title = n.Title,
                Content = n.Content,
                Category = n.Category.ToString(),
                Priority = (int)n.Priority,
                ImageUrl = n.FeaturedImageUrl,
                Status = n.IsPublished ? "Published" : "Draft",
                CreatedAt = n.CreatedAt,
                PublishedAt = n.PublishedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(newsItems);
    }

    [HttpPost("news")]
    [ProducesResponseType(typeof(NewsResponse), StatusCodes.Status201Created)]
    public async Task<ActionResult<NewsResponse>> CreateNews(
        [FromBody] CreateNewsRequest request,
        CancellationToken cancellationToken = default)
    {
        var adminId = GetUserId();

        var news = new News
        {
            NewsId = Guid.NewGuid(),
            CreatedByAdminId = adminId,
            Title = request.Title,
            Content = request.Content,
            Category = Enum.TryParse<NewsCategory>(request.Category, true, out var category)
                ? category
                : NewsCategory.Update,
            Priority = (Priority)request.Priority,
            FeaturedImageUrl = request.ImageUrl,
            IsPublished = false,
        };

        _db.News.Add(news);
        await _db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(UpdateNews), new { newsId = news.NewsId }, new NewsResponse
        {
            NewsId = news.NewsId,
            Title = news.Title,
            Content = news.Content,
            Category = news.Category.ToString(),
            Priority = (int)news.Priority,
            ImageUrl = news.FeaturedImageUrl,
            Status = news.IsPublished ? "Published" : "Draft",
            CreatedAt = news.CreatedAt,
            PublishedAt = news.PublishedAt,
        });
    }

    [HttpPut("news/{newsId:guid}")]
    [ProducesResponseType(typeof(NewsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<NewsResponse>> UpdateNews(
        Guid newsId,
        [FromBody] UpdateNewsRequest request,
        CancellationToken cancellationToken = default)
    {
        var news = await _db.News.FirstOrDefaultAsync(n => n.NewsId == newsId, cancellationToken);
        if (news == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            news.Title = request.Title;
        }

        if (!string.IsNullOrWhiteSpace(request.Content))
        {
            news.Content = request.Content;
        }

        if (!string.IsNullOrWhiteSpace(request.Category) && Enum.TryParse<NewsCategory>(request.Category, true, out var category))
        {
            news.Category = category;
        }

        if (request.Priority.HasValue)
        {
            news.Priority = (Priority)request.Priority.Value;
        }

        if (!string.IsNullOrWhiteSpace(request.ImageUrl))
        {
            news.FeaturedImageUrl = request.ImageUrl;
        }

        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new NewsResponse
        {
            NewsId = news.NewsId,
            Title = news.Title,
            Content = news.Content,
            Category = news.Category.ToString(),
            Priority = (int)news.Priority,
            ImageUrl = news.FeaturedImageUrl,
            Status = news.IsPublished ? "Published" : "Draft",
            CreatedAt = news.CreatedAt,
            PublishedAt = news.PublishedAt,
        });
    }

    [HttpPut("news/{newsId:guid}/publish")]
    [ProducesResponseType(typeof(NewsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<NewsResponse>> PublishNews(
        Guid newsId,
        [FromBody] PublishNewsRequest request,
        CancellationToken cancellationToken = default)
    {
        var news = await _db.News.FirstOrDefaultAsync(n => n.NewsId == newsId, cancellationToken);
        if (news == null)
        {
            return NotFound();
        }

        news.IsPublished = request.PublishNow;
        news.PublishedAt = request.PublishNow ? DateTime.UtcNow : request.ScheduleDate;
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new NewsResponse
        {
            NewsId = news.NewsId,
            Title = news.Title,
            Content = news.Content,
            Category = news.Category.ToString(),
            Priority = (int)news.Priority,
            ImageUrl = news.FeaturedImageUrl,
            Status = news.IsPublished ? "Published" : "Draft",
            CreatedAt = news.CreatedAt,
            PublishedAt = news.PublishedAt,
        });
    }

    [HttpGet("audit-logs")]
    [ProducesResponseType(typeof(List<AuditLogResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<AuditLogResponse>>> GetAuditLogs(CancellationToken cancellationToken = default)
    {
        var logs = await _db.AuditLogs
            .AsNoTracking()
            .OrderByDescending(l => l.CreatedAt)
            .Take(200)
            .Select(l => new AuditLogResponse
            {
                LogId = l.LogId,
                UserId = l.UserId,
                Action = l.Action,
                EntityType = l.EntityType ?? string.Empty,
                EntityId = l.EntityId,
                OldValues = l.OldValues,
                NewValues = l.NewValues,
                Timestamp = l.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(logs);
    }

    [HttpGet("statistics")]
    [ProducesResponseType(typeof(AdminStatisticsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminStatisticsResponse>> GetStatistics(CancellationToken cancellationToken = default)
    {
        var totalUsers = await _db.Users.CountAsync(cancellationToken);
        var totalJobs = await _db.JobPostings.CountAsync(cancellationToken);
        var totalApplications = await _db.JobApplications.CountAsync(cancellationToken);
        var totalComplaints = await _db.WorkerComplaints.CountAsync(cancellationToken);
        var pendingVerifications = await _db.Workers.CountAsync(w => w.VerificationStatus == VerificationStatus.Pending, cancellationToken)
            + await _db.RecruitmentAgencies.CountAsync(a => a.VerificationStatus == VerificationStatus.Pending, cancellationToken);
        var pendingApprovals = await _db.JobPostings.CountAsync(j => j.Status == JobStatus.Draft, cancellationToken);

        return Ok(new AdminStatisticsResponse
        {
            TotalUsers = totalUsers,
            TotalJobs = totalJobs,
            TotalApplications = totalApplications,
            TotalComplaints = totalComplaints,
            PendingVerifications = pendingVerifications,
            PendingApprovals = pendingApprovals,
        });
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
