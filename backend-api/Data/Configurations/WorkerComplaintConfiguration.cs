using LabourLinkAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabourLinkAPI.Data.Configurations;

public class WorkerComplaintConfiguration : IEntityTypeConfiguration<WorkerComplaint>
{
    public void Configure(EntityTypeBuilder<WorkerComplaint> builder)
    {
        builder.ToTable("worker_complaints");
        builder.HasKey(complaint => complaint.ComplaintId);

        builder.Property(complaint => complaint.Title)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(complaint => complaint.AttachmentUrl)
            .HasMaxLength(500);

        builder.Property(complaint => complaint.CreatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(complaint => complaint.UpdatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(complaint => complaint.SubmittedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(complaint => complaint.ReviewedAt)
            .HasColumnType("datetime(6)");

        builder.Property(complaint => complaint.ResolvedAt)
            .HasColumnType("datetime(6)");

        builder.HasIndex(complaint => complaint.WorkerId);
        builder.HasIndex(complaint => complaint.Status);
        builder.HasIndex(complaint => complaint.Priority);
    }
}
