using LabourLinkAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabourLinkAPI.Data.Configurations;

public class RecruitmentAgencyConfiguration : IEntityTypeConfiguration<RecruitmentAgency>
{
    public void Configure(EntityTypeBuilder<RecruitmentAgency> builder)
    {
        builder.ToTable("recruitment_agencies");
        builder.HasKey(agency => agency.AgencyId);

        builder.Property(agency => agency.CompanyName)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(agency => agency.CompanyRegistrationNumber)
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(agency => agency.CompanyRegistrationNumber)
            .IsUnique();

        builder.Property(agency => agency.LicenseNumber)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasIndex(agency => agency.LicenseNumber)
            .IsUnique();

        builder.Property(agency => agency.BusinessAddress)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(agency => agency.WebsiteUrl)
            .HasMaxLength(500);

        builder.Property(agency => agency.TaxId)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(agency => agency.BankAccount)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(agency => agency.OperatingCountries)
            .HasConversion(JsonListValueConverter.Converter)
            .HasColumnType("json")
            .Metadata.SetValueComparer(JsonListValueConverter.Comparer);

        builder.Property(agency => agency.Certifications)
            .HasConversion(JsonListValueConverter.Converter)
            .HasColumnType("json")
            .Metadata.SetValueComparer(JsonListValueConverter.Comparer);

        builder.Property(agency => agency.CreatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.Property(agency => agency.UpdatedAt)
            .HasColumnType("datetime(6)")
            .IsRequired();

        builder.HasIndex(agency => agency.UserId)
            .IsUnique();

        builder.HasOne(agency => agency.VerifiedByUser)
            .WithMany()
            .HasForeignKey(agency => agency.VerifiedBy)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(agency => agency.JobPostings)
            .WithOne(job => job.Agency)
            .HasForeignKey(job => job.AgencyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
