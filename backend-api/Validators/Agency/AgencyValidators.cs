using FluentValidation;
using LabourLinkAPI.Contracts.Agency;

namespace LabourLinkAPI.Validators.Agency;

public class CreateJobRequestValidator : AbstractValidator<CreateJobRequest>
{
    public CreateJobRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Job title is required")
            .Length(5, 200).WithMessage("Title must be between 5 and 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .Length(20, 2000).WithMessage("Description must be between 20 and 2000 characters");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Location is required");

        RuleFor(x => x.SalaryMin)
            .GreaterThan(0).WithMessage("Minimum salary must be greater than 0");

        RuleFor(x => x.SalaryMax)
            .GreaterThan(x => x.SalaryMin).WithMessage("Maximum salary must be greater than minimum salary");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required");

        RuleFor(x => x.EmploymentType)
            .NotEmpty().WithMessage("Employment type is required");

        RuleFor(x => x.DeadlineDate)
            .GreaterThan(DateTime.Now).When(x => x.DeadlineDate.HasValue)
            .WithMessage("Deadline must be in the future");
    }
}

public class UpdateJobRequestValidator : AbstractValidator<UpdateJobRequest>
{
    public UpdateJobRequestValidator()
    {
        RuleFor(x => x.Title)
            .Length(5, 200).WithMessage("Title must be between 5 and 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Title));

        RuleFor(x => x.SalaryMin)
            .GreaterThan(0).WithMessage("Minimum salary must be greater than 0")
            .When(x => x.SalaryMin.HasValue);

        RuleFor(x => x.SalaryMax)
            .GreaterThan(x => x.SalaryMin ?? 0).WithMessage("Maximum salary must be greater than minimum")
            .When(x => x.SalaryMax.HasValue);
    }
}

public class UpdateApplicationStatusRequestValidator : AbstractValidator<UpdateApplicationStatusRequest>
{
    public UpdateApplicationStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required")
            .Must(s => s == "Approved" || s == "Rejected" || s == "Pending")
            .WithMessage("Invalid status");

        RuleFor(x => x.RejectionReason)
            .NotEmpty().WithMessage("Rejection reason is required")
            .When(x => x.Status == "Rejected")
            .MaximumLength(500).WithMessage("Rejection reason cannot exceed 500 characters");
    }
}

public class UpdateAgencyProfileRequestValidator : AbstractValidator<UpdateAgencyProfileRequest>
{
    public UpdateAgencyProfileRequestValidator()
    {
        RuleFor(x => x.Name)
            .Length(3, 150).WithMessage("Name must be between 3 and 150 characters")
            .When(x => !string.IsNullOrEmpty(x.Name));

        RuleFor(x => x.Website)
            .Must(url => string.IsNullOrEmpty(url) || Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Website URL must be valid")
            .When(x => !string.IsNullOrEmpty(x.Website));

        RuleFor(x => x.ContactEmail)
            .EmailAddress().WithMessage("Contact email must be valid")
            .When(x => !string.IsNullOrEmpty(x.ContactEmail));
    }
}
