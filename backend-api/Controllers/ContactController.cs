using LabourLinkAPI.Services.Email;
using Microsoft.AspNetCore.Mvc;

namespace LabourLinkAPI.Controllers;

[ApiController]
[Route("api/contact")]
public sealed class ContactController : ControllerBase
{
    private readonly IEmailService _emailService;

    public ContactController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SendContact(
        [FromBody] ContactRequest request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new { message = "Name, email, and message are required." });
        }

        await _emailService.SendContactEmailAsync(
            request.Name.Trim(),
            request.Email.Trim(),
            string.IsNullOrWhiteSpace(request.Subject) ? "General Enquiry" : request.Subject.Trim(),
            request.Message.Trim(),
            cancellationToken);

        return Ok(new { message = "Your message has been sent. We will get back to you shortly." });
    }
}

public class ContactRequest
{
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string? Subject { get; set; }
    public string Message { get; set; } = default!;
}
