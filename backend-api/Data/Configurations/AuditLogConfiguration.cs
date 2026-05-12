using LabourLinkAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabourLinkAPI.Data.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");
        builder.HasKey(log => log.LogId);

        builder.Property(log => log.Action)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(log => log.EntityType)
            .HasMaxLength(100);

        builder.Property(log => log.EntityId)
            .HasMaxLength(100);

        builder.Property(log => log.OldValues)
            .HasColumnType("json");

        builder.Property(log => log.NewValues)
            .HasColumnType("json");

        builder.Property(log => log.IpAddress)
            .HasMaxLength(50);

        builder.Property(log => log.UserAgent)
            .HasMaxLength(500);

        builder.Property(log => log.CreatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.HasIndex(log => log.UserId);
        builder.HasIndex(log => log.CreatedAt);
    }
}
