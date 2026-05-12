using System.Security.Claims;
using LabourLinkAPI.Contracts.Auth;
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
                PassportNumber = "Unknown",
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
            {
                worker.Nationality = request.Nationality;
            }

            if (!string.IsNullOrWhiteSpace(request.Location))
            {
                worker.CurrentLocation = request.Location;
            }

            if (request.Experience.HasValue)
            {
                worker.YearsOfExperience = request.Experience.Value;
            }
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
            return BadRequest(new MessageResponse { Message = "Worker profile not found" });
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
                CreatedAt = c.CreatedAt,
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
            CreatedAt = complaint.CreatedAt,
            UpdatedAt = complaint.UpdatedAt,
            History = new List<ComplaintUpdateHistory>(),
        });
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
