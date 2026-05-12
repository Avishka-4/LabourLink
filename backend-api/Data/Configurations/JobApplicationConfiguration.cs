using LabourLinkAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabourLinkAPI.Data.Configurations;

public class JobApplicationConfiguration : IEntityTypeConfiguration<JobApplication>
{
    public void Configure(EntityTypeBuilder<JobApplication> builder)
    {
        builder.ToTable("job_applications");
        builder.HasKey(application => application.ApplicationId);

        builder.Property(application => application.ResumeUrl)
            .HasMaxLength(500);

        builder.Property(application => application.RejectionReason)
            .HasMaxLength(500);

        builder.Property(application => application.InterviewLocation)
            .HasMaxLength(255);

        builder.Property(application => application.AppliedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(application => application.ReviewedAt)
            .HasColumnType("datetime(6)");

        builder.Property(application => application.InterviewDate)
            .HasColumnType("datetime(6)");

        builder.Property(application => application.CreatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(application => application.UpdatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.HasIndex(application => application.JobId);
        builder.HasIndex(application => application.JobSeekerId);
        builder.HasIndex(application => application.Status);

        builder.HasOne(application => application.Job)
            .WithMany(job => job.Applications)
            .HasForeignKey(application => application.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(application => application.JobSeeker)
            .WithMany(seeker => seeker.Applications)
            .HasForeignKey(application => application.JobSeekerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
