using HotChocolate.Types;
using LabourLinkAPI.Models.Entities;

namespace LabourLinkAPI.GraphQL.Types;

public class NewsType : ObjectType<News>
{
    protected override void Configure(IObjectTypeDescriptor<News> descriptor)
    {
        descriptor.Name("NewsArticle");

        descriptor.Field(n => n.NewsId).Name("id");
        descriptor.Field(n => n.Title).Name("title");
        descriptor.Field(n => n.Content).Name("content");
        descriptor.Field(n => n.Category).Name("category");
        descriptor.Field(n => n.Priority).Name("priority");
        descriptor.Field(n => n.FeaturedImageUrl).Name("featuredImageUrl");
        descriptor.Field(n => n.PublishedAt).Name("publishedAt");
        descriptor.Field(n => n.ViewCount).Name("viewCount");

        descriptor.Ignore(n => n.CreatedByAdminId);
        descriptor.Ignore(n => n.CreatedByAdmin);
        descriptor.Ignore(n => n.IsPublished);
        descriptor.Ignore(n => n.CreatedAt);
        descriptor.Ignore(n => n.UpdatedAt);
        descriptor.Ignore(n => n.ExpiresAt);
    }
}