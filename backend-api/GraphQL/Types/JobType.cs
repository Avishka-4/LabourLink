using HotChocolate.Types;
using LabourLinkAPI.Models.Entities;

namespace LabourLinkAPI.GraphQL.Types;

public class JobType : ObjectType<JobPosting>
{
    protected override void Configure(IObjectTypeDescriptor<JobPosting> descriptor)
    {
        descriptor.Name("Job");

        descriptor.Field(j => j.JobId).Name("id");
        descriptor.Field(j => j.JobTitle).Name("title");
        descriptor.Field(j => j.JobDescription).Name("description");
        descriptor.Field(j => j.JobCategory).Name("category");
        descriptor.Field(j => j.EmploymentType).Name("employmentType");
        descriptor.Field(j => j.Location).Name("location");
        descriptor.Field(j => j.Country).Name("country");
        descriptor.Field(j => j.SalaryMin).Name("salaryMin");
        descriptor.Field(j => j.SalaryMax).Name("salaryMax");
        descriptor.Field(j => j.SalaryCurrency).Name("salaryCurrency");
        descriptor.Field(j => j.Requirements).Name("requirements");
        descriptor.Field(j => j.RequiredExperience).Name("requiredExperience");
        descriptor.Field(j => j.EducationRequired).Name("educationRequired");
        descriptor.Field(j => j.ApplicationDeadline).Name("applicationDeadline");
        descriptor.Field(j => j.IsFeatured).Name("isFeatured");
        descriptor.Field(j => j.PostedAt).Name("postedAt");
        descriptor.Field(j => j.ViewCount).Name("viewCount");
        descriptor.Field(j => j.ApplyCount).Name("applyCount");

        descriptor.Ignore(j => j.AgencyId);
        descriptor.Ignore(j => j.Agency);
        descriptor.Ignore(j => j.Applications);
        descriptor.Ignore(j => j.Status);
        descriptor.Ignore(j => j.FeaturedUntil);
        descriptor.Ignore(j => j.ExpiresAt);
        descriptor.Ignore(j => j.CreatedAt);
        descriptor.Ignore(j => j.UpdatedAt);
    }
}
