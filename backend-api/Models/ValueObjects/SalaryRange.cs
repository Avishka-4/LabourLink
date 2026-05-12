namespace LabourLinkAPI.Models.ValueObjects;

public sealed record SalaryRange(
    decimal? Min,
    decimal? Max,
    string? Currency
);
