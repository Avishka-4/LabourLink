using LabourLinkAPI.Models.Entities;
using LabourLinkAPI.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabourLinkAPI.Data.Configurations;

public class LookupValueConfiguration : IEntityTypeConfiguration<LookupValue>
{
    public void Configure(EntityTypeBuilder<LookupValue> builder)
    {
        builder.ToTable("lookup_values");
        builder.HasKey(value => value.LookupId);

        builder.Property(value => value.Category)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(value => value.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasIndex(value => new { value.Category, value.Value })
            .IsUnique();

        builder.HasData(BuildLookupValues());
    }

    private static IEnumerable<LookupValue> BuildLookupValues()
    {
        var lookupId = 1;

        foreach (var entry in Enum.GetValues<UserRole>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "UserRole", Value = (int)entry, Name = entry.ToString() };
        }

        foreach (var entry in Enum.GetValues<UserStatus>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "UserStatus", Value = (int)entry, Name = entry.ToString() };
        }

        foreach (var entry in Enum.GetValues<Gender>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "Gender", Value = (int)entry, Name = entry.ToString() };
        }

        foreach (var entry in Enum.GetValues<VerificationStatus>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "VerificationStatus", Value = (int)entry, Name = entry.ToString() };
        }

        foreach (var entry in Enum.GetValues<EmploymentType>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "EmploymentType", Value = (int)entry, Name = entry.ToString() };
        }

        foreach (var entry in Enum.GetValues<EducationLevel>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "EducationLevel", Value = (int)entry, Name = entry.ToString() };
        }

        foreach (var entry in Enum.GetValues<JobStatus>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "JobStatus", Value = (int)entry, Name = entry.ToString() };
        }

        foreach (var entry in Enum.GetValues<ComplaintStatus>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "ComplaintStatus", Value = (int)entry, Name = entry.ToString() };
        }

        foreach (var entry in Enum.GetValues<ComplaintType>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "ComplaintType", Value = (int)entry, Name = entry.ToString() };
        }

        foreach (var entry in Enum.GetValues<ApplicationStatus>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "ApplicationStatus", Value = (int)entry, Name = entry.ToString() };
        }

        foreach (var entry in Enum.GetValues<NewsCategory>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "NewsCategory", Value = (int)entry, Name = entry.ToString() };
        }

        foreach (var entry in Enum.GetValues<Priority>())
        {
            yield return new LookupValue { LookupId = lookupId++, Category = "Priority", Value = (int)entry, Name = entry.ToString() };
        }
    }
}
