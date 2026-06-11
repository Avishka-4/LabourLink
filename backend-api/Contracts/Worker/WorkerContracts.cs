namespace LabourLinkAPI.Contracts.Worker;

public class UpdateWorkerProfileRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Skills { get; set; }
    public string? Location { get; set; }
    public int? Experience { get; set; }
    public string? Education { get; set; }
    public string? Nationality { get; set; }
}

public class WorkerProfileResponse
{
    public Guid WorkerId { get; set; }
    public Guid UserId { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Nationality { get; set; }
    public string? Skills { get; set; }
    public string? Location { get; set; }
    public int? Experience { get; set; }
    public string? Education { get; set; }
    public string? Status { get; set; }
}

public class CreateComplaintRequest
{
    public string Type { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string? AttachmentUrl { get; set; }
    public string? TargetAgencyName { get; set; }
}

public class ComplaintResponse
{
    public Guid ComplaintId { get; set; }
    public string Type { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Status { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}

public class ComplaintDetailResponse
{
    public Guid ComplaintId { get; set; }
    public string Type { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string? AttachmentUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<ComplaintUpdateHistory> History { get; set; } = [];
}

public class ComplaintUpdateHistory
{
    public DateTime UpdatedAt { get; set; }
    public string? UpdateNotes { get; set; }
}

public class UpdateComplaintRequest
{
    public string? UpdateNotes { get; set; }
}

public class DocumentResponse
{
    public int DocumentId { get; set; }
    public string Type { get; set; } = default!;
    public DateTime UploadedDate { get; set; }
    public string Url { get; set; } = default!;
}

public class GovernmentLinkResponse
{
    public string Name { get; set; } = default!;
    public string Url { get; set; } = default!;
    public string Category { get; set; } = default!;
    public string Description { get; set; } = default!;
}