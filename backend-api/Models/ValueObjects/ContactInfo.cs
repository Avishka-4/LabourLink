namespace LabourLinkAPI.Models.ValueObjects;

public sealed record ContactInfo(
    string Email,
    string PhoneNumber,
    string? AlternatePhoneNumber
);
