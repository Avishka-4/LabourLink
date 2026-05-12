namespace LabourLinkAPI.Services.Common;

public sealed class ErrorResponse
{
    public string Message { get; init; } = string.Empty;
    public string? ErrorCode { get; init; }
    public object? Details { get; init; }
}
