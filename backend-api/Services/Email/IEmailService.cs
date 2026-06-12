namespace LabourLinkAPI.Services.Email;

public interface IEmailService
{
    Task SendContactEmailAsync(
        string senderName,
        string senderEmail,
        string subject,
        string message,
        CancellationToken cancellationToken = default);
}
