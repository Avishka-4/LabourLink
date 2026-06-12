using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LabourLinkAPI.Controllers;

[ApiController]
[Route("api/upload")]
[Authorize]
public sealed class UploadController : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions =
        new(StringComparer.OrdinalIgnoreCase) { ".pdf", ".jpg", ".jpeg", ".png", ".webp", ".doc", ".docx" };

    private readonly IWebHostEnvironment _env;

    public UploadController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpPost("document")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadDocument(
        IFormFile file,
        [FromForm] string documentType,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
            return BadRequest("No file provided");

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest("File exceeds 5 MB limit");

        var ext = System.IO.Path.GetExtension(file.FileName);
        if (!AllowedExtensions.Contains(ext))
            return BadRequest("Invalid file type. Allowed: pdf, jpg, jpeg, png, webp, doc, docx");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        var webRoot = string.IsNullOrEmpty(_env.WebRootPath)
            ? System.IO.Path.Combine(_env.ContentRootPath, "wwwroot")
            : _env.WebRootPath;

        var uploadsDir = System.IO.Path.Combine(webRoot, "uploads", userId);
        Directory.CreateDirectory(uploadsDir);

        var safeType = string.Concat(documentType.Where(c => char.IsLetterOrDigit(c) || c == '-' || c == '_'));
        var fileName = $"{safeType}_{Guid.NewGuid()}{ext.ToLowerInvariant()}";
        var filePath = System.IO.Path.Combine(uploadsDir, fileName);

        await using var stream = System.IO.File.Create(filePath);
        await file.CopyToAsync(stream, cancellationToken);

        return Ok(new { url = $"/uploads/{userId}/{fileName}", documentType });
    }
}
