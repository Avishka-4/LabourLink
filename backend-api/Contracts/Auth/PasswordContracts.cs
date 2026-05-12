namespace LabourLinkAPI.Contracts.Auth;

public class ForgotPasswordRequest
{
    public string Email { get; set; } = default!;
}

public class ResetPasswordRequest
{
    public string Token { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string NewPassword { get; set; } = default!;
    public string ConfirmPassword { get; set; } = default!;
}

public class ResetPasswordResponse
{
    public string Message { get; set; } = default!;
}
