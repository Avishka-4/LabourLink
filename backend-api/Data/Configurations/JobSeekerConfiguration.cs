using LabourLinkAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabourLinkAPI.Data.Configurations;

public class JobSeekerConfiguration : IEntityTypeConfiguration<JobSeeker>
{
    public void Configure(EntityTypeBuilder<JobSeeker> builder)
    {
        builder.ToTable("job_seekers");
        builder.HasKey(jobSeeker => jobSeeker.JobSeekerId);

        builder.Property(jobSeeker => jobSeeker.EducationLevel)
            .IsRequired();

        builder.Property(jobSeeker => jobSeeker.Qualification)
            .IsRequired();

        builder.Property(jobSeeker => jobSeeker.DesiredJobRole)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(jobSeeker => jobSeeker.DesiredLocation)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(jobSeeker => jobSeeker.ExpectedSalary)
            .HasPrecision(10, 2);

        builder.Property(jobSeeker => jobSeeker.AvailabilityDate)
            .HasColumnType("date");

        builder.Property(jobSeeker => jobSeeker.Languages)
            .HasConversion(JsonListValueConverter.Converter)
            .HasColumnType("json")
            .Metadata.SetValueComparer(JsonListValueConverter.Comparer);

        builder.Property(jobSeeker => jobSeeker.Certifications)
            .HasConversion(JsonListValueConverter.Converter)
            .HasColumnType("json")
            .Metadata.SetValueComparer(JsonListValueConverter.Comparer);

        builder.Property(jobSeeker => jobSeeker.CreatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(jobSeeker => jobSeeker.UpdatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.HasIndex(jobSeeker => jobSeeker.UserId)
            .IsUnique();
    }
}
