using LabourLinkAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabourLinkAPI.Data.Configurations;

public class NewsConfiguration : IEntityTypeConfiguration<News>
{
    public void Configure(EntityTypeBuilder<News> builder)
    {
        builder.ToTable("news");
        builder.HasKey(news => news.NewsId);

        builder.Property(news => news.Title)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(news => news.FeaturedImageUrl)
            .HasMaxLength(500);

        builder.Property(news => news.PublishedAt)
            .HasColumnType("datetime(6)");

        builder.Property(news => news.ExpiresAt)
            .HasColumnType("datetime(6)");

        builder.Property(news => news.CreatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(news => news.UpdatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.HasIndex(news => news.Category);
        builder.HasIndex(news => news.IsPublished);
        builder.HasIndex(news => news.CreatedByAdminId);
    }
}
