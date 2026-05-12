using LabourLinkAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabourLinkAPI.Data.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("refresh_tokens");
        builder.HasKey(token => token.TokenId);

        builder.Property(token => token.Token)
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(token => token.ExpiryDate)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(token => token.CreatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(token => token.RevokedAt)
            .HasColumnType("datetime(6)");

        builder.HasIndex(token => token.UserId);
        builder.HasIndex(token => token.Token)
            .IsUnique();
    }
}
