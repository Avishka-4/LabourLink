using LabourLinkAPI.Models.Entities;
using LabourLinkAPI.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabourLinkAPI.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(user => user.UserId);

        builder.Property(user => user.Email)
            .HasMaxLength(255)
            .IsRequired();

        builder.HasIndex(user => user.Email)
            .IsUnique();

        builder.Property(user => user.PasswordHash)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(user => user.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(user => user.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(user => user.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(user => user.ProfileImageUrl)
            .HasMaxLength(500);

        builder.Property(user => user.Role)
            .IsRequired();

        builder.Property(user => user.IsEmailVerified)
            .HasDefaultValue(false);

        builder.Property(user => user.IsPhoneVerified)
            .HasDefaultValue(false);

        builder.Property(user => user.Status)
            .IsRequired();

        builder.Property(user => user.CreatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(user => user.UpdatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(user => user.LastLoginAt)
            .HasColumnType("datetime(6)");

        builder.HasOne(user => user.Worker)
            .WithOne(worker => worker.User)
            .HasForeignKey<Worker>(worker => worker.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(user => user.JobSeeker)
            .WithOne(jobSeeker => jobSeeker.User)
            .HasForeignKey<JobSeeker>(jobSeeker => jobSeeker.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(user => user.Agency)
            .WithOne(agency => agency.User)
            .HasForeignKey<RecruitmentAgency>(agency => agency.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(user => user.AssignedComplaints)
            .WithOne(complaint => complaint.AssignedToAdmin)
            .HasForeignKey(complaint => complaint.AssignedToAdminId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(user => user.CreatedNews)
            .WithOne(news => news.CreatedByAdmin)
            .HasForeignKey(news => news.CreatedByAdminId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(user => user.AuditLogs)
            .WithOne(log => log.User)
            .HasForeignKey(log => log.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(user => user.RefreshTokens)
            .WithOne(token => token.User)
            .HasForeignKey(token => token.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(user => user.ReviewedApplications)
            .WithOne(application => application.ReviewedByUser)
            .HasForeignKey(application => application.ReviewedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
