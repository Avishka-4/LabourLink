using LabourLinkAPI.Contracts.Admin;
using LabourLinkAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabourLinkAPI.Controllers;

[ApiController]
[Route("api/news")]
[AllowAnonymous]
public sealed class NewsController : ControllerBase
{
    private readonly LabourLinkDbContext _db;

    public NewsController(LabourLinkDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<NewsResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<NewsResponse>>> GetNews(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var newsItems = await _db.News
            .AsNoTracking()
            .Where(n => n.IsPublished && (n.PublishedAt == null || n.PublishedAt <= now))
            .OrderByDescending(n => n.PublishedAt ?? n.CreatedAt)
            .Select(n => new NewsResponse
            {
                NewsId = n.NewsId,
                Title = n.Title,
                Content = n.Content,
                Category = n.Category.ToString(),
                Priority = (int)n.Priority,
                ImageUrl = n.FeaturedImageUrl,
                Status = "Published",
                CreatedAt = n.CreatedAt,
                PublishedAt = n.PublishedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(newsItems);
    }
}
