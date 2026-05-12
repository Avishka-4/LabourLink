using FluentValidation;
using LabourLinkAPI.Contracts.Worker;

namespace LabourLinkAPI.Validators.Worker;

public class CreateComplaintRequestValidator : AbstractValidator<CreateComplaintRequest>
{
    public CreateComplaintRequestValidator()
    {
        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Complaint type is required")
            .Length(2, 50).WithMessage("Type must be between 2 and 50 characters");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .Length(5, 200).WithMessage("Title must be between 5 and 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .Length(10, 1000).WithMessage("Description must be between 10 and 1000 characters");
    }
}

public class UpdateComplaintRequestValidator : AbstractValidator<UpdateComplaintRequest>
{
    public UpdateComplaintRequestValidator()
    {
        RuleFor(x => x.UpdateNotes)
            .MaximumLength(500).WithMessage("Update notes cannot exceed 500 characters");
    }
}

public class UpdateWorkerProfileRequestValidator : AbstractValidator<UpdateWorkerProfileRequest>
{
    public UpdateWorkerProfileRequestValidator()
    {
        RuleFor(x => x.Experience)
            .GreaterThanOrEqualTo(0).WithMessage("Experience cannot be negative")
            .LessThanOrEqualTo(60).WithMessage("Experience cannot exceed 60 years");

        RuleFor(x => x.Skills)
            .MaximumLength(500).WithMessage("Skills cannot exceed 500 characters");

        RuleFor(x => x.Location)
            .MaximumLength(100).WithMessage("Location cannot exceed 100 characters");
    }
}
