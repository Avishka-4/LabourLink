using FluentValidation;
using LabourLinkAPI.Contracts.Admin;

namespace LabourLinkAPI.Validators.Admin;

public class CreateNewsRequestValidator : AbstractValidator<CreateNewsRequest>
{
    public CreateNewsRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .Length(5, 200).WithMessage("Title must be between 5 and 200 characters");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required")
            .Length(20, 5000).WithMessage("Content must be between 20 and 5000 characters");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required");

        RuleFor(x => x.Priority)
            .GreaterThanOrEqualTo(1).WithMessage("Priority must be at least 1")
            .LessThanOrEqualTo(5).WithMessage("Priority must be at most 5");
    }
}

public class UpdateComplaintStatusRequestValidator : AbstractValidator<UpdateComplaintStatusRequest>
{
    public UpdateComplaintStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required")
            .Must(s => s == "Open" || s == "InProgress" || s == "Resolved" || s == "Closed")
            .WithMessage("Invalid status");

        RuleFor(x => x.ResolutionNotes)
            .NotEmpty().WithMessage("Resolution notes required")
            .When(x => x.Status == "Resolved" || x.Status == "Closed")
            .MaximumLength(1000).WithMessage("Resolution notes cannot exceed 1000 characters");
    }
}

public class VerificationRequestValidator : AbstractValidator<VerificationRequest>
{
    public VerificationRequestValidator()
    {
        RuleFor(x => x.RejectionReason)
            .NotEmpty().WithMessage("Rejection reason is required")
            .When(x => !x.IsApproved)
            .MaximumLength(500).WithMessage("Rejection reason cannot exceed 500 characters");
    }
}

public class AssignComplaintRequestValidator : AbstractValidator<AssignComplaintRequest>
{
    public AssignComplaintRequestValidator()
    {
        RuleFor(x => x.AssignedToAdminId)
            .NotEmpty().WithMessage("Admin ID must be valid");
    }
}