namespace LabourLinkAPI.Services.Email;

public class SesOptions
{
    public string Region { get; set; } = "us-east-1";
    public string AccessKeyId { get; set; } = default!;
    public string SecretAccessKey { get; set; } = default!;
    public string FromAddress { get; set; } = default!;
    public string FromName { get; set; } = "LabourLink";
    public string ToAddress { get; set; } = default!;
}
