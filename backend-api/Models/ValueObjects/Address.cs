namespace LabourLinkAPI.Models.ValueObjects;

public sealed record Address(
    string Street1,
    string? Street2,
    string City,
    string? State,
    string? PostalCode,
    string Country
);
