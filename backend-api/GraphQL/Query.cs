using LabourLinkAPI.Data;
using LabourLinkAPI.Models.Entities;
using LabourLinkAPI.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace LabourLinkAPI.GraphQL;

public class Query
{
    public async Task<JobsResult> GetJobsAsync(
        [Service] LabourLinkDbContext db,
        string? search = null,
        string? category = null,
        string? location = null,
        EmploymentType? employmentType = null,
        int page = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        pageSize = Math.Clamp(pageSize, 1, 50);
        page = Math.Max(1, page);

        var query = db.JobPostings.Where(j => j.Status == JobStatus.Published);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(j =>
                j.JobTitle.ToLower().Contains(term) ||
                j.JobDescription.ToLower().Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(j => j.JobCategory == category);

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(j => j.Location.ToLower().Contains(location.ToLower()));

        if (employmentType.HasValue)
            query = query.Where(j => j.EmploymentType == employmentType.Value);

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(j => j.IsFeatured)
            .ThenByDescending(j => j.PostedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new JobsResult(items, total, page, pageSize);
    }

    public async Task<JobPosting?> GetJobAsync(
        [Service] LabourLinkDbContext db,
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await db.JobPostings
            .Where(j => j.JobId == id && j.Status == JobStatus.Published)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<NewsResult> GetNewsAsync(
        [Service] LabourLinkDbContext db,
        NewsCategory? category = null,
        int page = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        pageSize = Math.Clamp(pageSize, 1, 50);
        page = Math.Max(1, page);

        var query = db.News.Where(n => n.IsPublished);

        if (category.HasValue)
            query = query.Where(n => n.Category == category.Value);

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(n => n.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new NewsResult(items, total, page, pageSize);
    }

    public async Task<News?> GetNewsArticleAsync(
        [Service] LabourLinkDbContext db,
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await db.News
            .Where(n => n.NewsId == id && n.IsPublished)
            .FirstOrDefaultAsync(cancellationToken);
    }
}

public record JobsResult(List<JobPosting> Items, int Total, int Page, int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)Total / PageSize);
}

public record NewsResult(List<News> Items, int Total, int Page, int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)Total / PageSize);
}
