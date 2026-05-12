using LabourLinkAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabourLinkAPI.Data.Configurations;

public class WorkerConfiguration : IEntityTypeConfiguration<Worker>
{
    public void Configure(EntityTypeBuilder<Worker> builder)
    {
        builder.ToTable("workers");
        builder.HasKey(worker => worker.WorkerId);

        builder.Property(worker => worker.WorkerRegistrationNumber)
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(worker => worker.WorkerRegistrationNumber)
            .IsUnique();

        builder.Property(worker => worker.Nationality)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(worker => worker.PassportNumber)
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(worker => worker.PassportNumber)
            .IsUnique();

        builder.Property(worker => worker.DateOfBirth)
            .HasColumnType("date")
            .IsRequired();

        builder.Property(worker => worker.Gender)
            .IsRequired();

        builder.Property(worker => worker.CurrentLocation)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(worker => worker.DesiredLocation)
            .HasMaxLength(255);

        builder.Property(worker => worker.YearsOfExperience)
            .IsRequired();

        builder.Property(worker => worker.Skills)
            .HasConversion(JsonListValueConverter.Converter)
            .HasColumnType("json")
            .Metadata.SetValueComparer(JsonListValueConverter.Comparer);

        builder.Property(worker => worker.VerificationStatus)
            .IsRequired();

        builder.Property(worker => worker.EmergencyContactName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(worker => worker.EmergencyContactPhone)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(worker => worker.CreatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(worker => worker.UpdatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.HasOne(worker => worker.VerifiedByUser)
            .WithMany()
            .HasForeignKey(worker => worker.VerifiedBy)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(worker => worker.Complaints)
            .WithOne(complaint => complaint.Worker)
            .HasForeignKey(complaint => complaint.WorkerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(worker => worker.JobApplications)
            .WithOne(application => application.Worker)
            .HasForeignKey(application => application.WorkerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
