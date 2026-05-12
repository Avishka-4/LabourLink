import * as React from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../common/Card";

export interface ForgotPasswordFormData {
  email: string;
}

export interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  successMessage?: string;
}

const ForgotPasswordForm = React.forwardRef<HTMLFormElement, ForgotPasswordFormProps>(
  ({
    onSubmit,
    isLoading = false,
    error,
    successMessage,
  }, ref) => {
    const [email, setEmail] = React.useState("");
    const [emailError, setEmailError] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);

    const validateForm = () => {
      let emailErr = "";

      if (!email) {
        emailErr = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailErr = "Please enter a valid email";
      }

      return emailErr;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const emailErr = validateForm();

      if (emailErr) {
        setEmailError(emailErr);
        return;
      }

      setEmailError("");

      try {
        await onSubmit({ email });
        setSubmitted(true);
      } catch {
        // Error handled by parent
      }
    };

    if (submitted && successMessage) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto text-green-600">
                <path
                  d="M9 16.17L4.83 12m0 0L3 13.83m1.83-1.83L9 12m0 0l4.17-4.17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-sm text-muted-foreground">
                {successMessage}
              </p>
              <Button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
              >
                Send Another Email
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={ref} onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Send Reset Link
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    );
  }
);

ForgotPasswordForm.displayName = "ForgotPasswordForm";

export { ForgotPasswordForm };

// Reset Password Form
export interface ResetPasswordFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormProps {
  token: string;
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const ResetPasswordForm = React.forwardRef<HTMLFormElement, ResetPasswordFormProps>(
  ({
    token,
    onSubmit,
    isLoading = false,
    error,
  }, ref) => {
    const [formData, setFormData] = React.useState<ResetPasswordFormData>({
      email: "",
      password: "",
      confirmPassword: "",
    });
    const [errors, setErrors] = React.useState<Partial<ResetPasswordFormData>>({});

    const validateForm = () => {
      const newErrors: Partial<ResetPasswordFormData> = {};

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors = validateForm();

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});

      try {
        await onSubmit(formData);
      } catch {
        // Error handled by parent
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={ref} onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email as string}
              required
              disabled={isLoading}
            />

            <Input
              id="password"
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password as string}
              hint="At least 8 characters"
              required
              disabled={isLoading}
            />

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword as string}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
);

ResetPasswordForm.displayName = "ResetPasswordForm";

export { ResetPasswordForm };
