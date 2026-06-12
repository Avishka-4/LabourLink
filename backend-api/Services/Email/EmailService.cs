using Amazon;
using Amazon.Runtime;
using Amazon.SimpleEmailV2;
using Amazon.SimpleEmailV2.Model;
using Microsoft.Extensions.Options;

namespace LabourLinkAPI.Services.Email;

public class EmailService : IEmailService
{
    private readonly SesOptions _options;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<SesOptions> options, ILogger<EmailService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public async Task SendContactEmailAsync(
        string senderName,
        string senderEmail,
        string subject,
        string message,
        CancellationToken cancellationToken = default)
    {
        var credentials = new BasicAWSCredentials(_options.AccessKeyId, _options.SecretAccessKey);
        using var client = new AmazonSimpleEmailServiceV2Client(
            credentials,
            RegionEndpoint.GetBySystemName(_options.Region));

        var body = $"""
            New contact form submission via LabourLink

            Name:    {senderName}
            Email:   {senderEmail}
            Subject: {subject}

            Message:
            {message}

            ---
            Sent via LabourLink Contact Form
            """;

        var request = new SendEmailRequest
        {
            FromEmailAddress = $"{_options.FromName} <{_options.FromAddress}>",
            Destination = new Destination
            {
                ToAddresses = [_options.ToAddress],
            },
            ReplyToAddresses = [$"{senderName} <{senderEmail}>"],
            Content = new EmailContent
            {
                Simple = new Message
                {
                    Subject = new Content { Data = $"[LabourLink Contact] {subject}" },
                    Body = new Body
                    {
                        Text = new Content { Data = body },
                    },
                },
            },
        };

        try
        {
            await client.SendEmailAsync(request, cancellationToken);
            _logger.LogInformation("SES email sent from {SenderEmail}", senderEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "SES failed to send contact email from {SenderEmail}", senderEmail);
            throw;
        }
    }
}
