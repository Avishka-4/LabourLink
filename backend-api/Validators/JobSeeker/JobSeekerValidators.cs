using FluentValidation;
using LabourLinkAPI.Contracts.JobSeeker;

namespace LabourLinkAPI.Validators.JobSeeker;

public class JobApplicationRequestValidator : AbstractValidator<JobApplicationRequest>
{
    public JobApplicationRequestValidator()
    {
        RuleFor(x => x.CoverLetter)
            .MaximumLength(1000).WithMessage("Cover letter cannot exceed 1000 characters");

        RuleFor(x => x.ResumeUrl)
            .Must(url => string.IsNullOrEmpty(url) || Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Resume URL must be valid");
    }
}

public class UpdateJobSeekerProfileRequestValidator : AbstractValidator<UpdateJobSeekerProfileRequest>
{
    public UpdateJobSeekerProfileRequestValidator()
    {
        RuleFor(x => x.Education)
            .MaximumLength(200).WithMessage("Education cannot exceed 200 characters");

        RuleFor(x => x.Qualifications)
            .MaximumLength(500).WithMessage("Qualifications cannot exceed 500 characters");

        RuleFor(x => x.Languages)
            .MaximumLength(200).WithMessage("Languages cannot exceed 200 characters");

        RuleFor(x => x.Location)
            .MaximumLength(100).WithMessage("Location cannot exceed 100 characters");
    }
}
