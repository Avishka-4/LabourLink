using LabourLinkAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabourLinkAPI.Data.Configurations;

public class JobPostingConfiguration : IEntityTypeConfiguration<JobPosting>
{
    public void Configure(EntityTypeBuilder<JobPosting> builder)
    {
        builder.ToTable("job_postings");
        builder.HasKey(job => job.JobId);

        builder.Property(job => job.JobTitle)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(job => job.JobDescription)
            .IsRequired();

        builder.Property(job => job.JobCategory)
            .HasMaxLength(100);

        builder.Property(job => job.Location)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(job => job.Country)
            .HasMaxLength(100);

        builder.Property(job => job.SalaryMin)
            .HasPrecision(10, 2);

        builder.Property(job => job.SalaryMax)
            .HasPrecision(10, 2);

        builder.Property(job => job.SalaryCurrency)
            .HasMaxLength(10);

        builder.Property(job => job.Requirements)
            .HasConversion(JsonListValueConverter.Converter)
            .HasColumnType("json")
            .Metadata.SetValueComparer(JsonListValueConverter.Comparer);

        builder.Property(job => job.EducationRequired)
            .HasMaxLength(100);

        builder.Property(job => job.ApplicationDeadline)
            .HasColumnType("date");

        builder.Property(job => job.PostedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(job => job.FeaturedUntil)
            .HasColumnType("datetime(6)");

        builder.Property(job => job.UpdatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(job => job.ExpiresAt)
            .HasColumnType("datetime(6)");

        builder.Property(job => job.CreatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.HasIndex(job => job.AgencyId);
        builder.HasIndex(job => job.Status);
        builder.HasIndex(job => job.Location);
    }
}
