import * as React from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Checkbox } from "../common/Checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../common/Card";

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  onForgotPassword?: () => void;
  redirectText?: string;
  redirectLink?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm = React.forwardRef<HTMLFormElement, LoginFormProps>(
  ({
    onSubmit,
    isLoading = false,
    error,
    onForgotPassword,
    redirectText,
    redirectLink,
  }, ref) => {
    const [formData, setFormData] = React.useState<LoginFormData>({
      email: "",
      password: "",
      rememberMe: false,
    });
    const [errors, setErrors] = React.useState<Partial<LoginFormData>>({});

    const validateForm = () => {
      const newErrors: Partial<LoginFormData> = {};

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
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
        // Error is handled by parent component
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
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
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password as string}
              required
              disabled={isLoading}
            />

            <div className="flex items-center justify-between gap-2">
              <Checkbox
                id="rememberMe"
                label="Remember me"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, rememberMe: !!checked })
                }
              />
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign In
            </Button>

            {redirectText && redirectLink && (
              <p className="text-center text-sm text-muted-foreground">
                {redirectText}{" "}
                <a href={redirectLink} className="text-primary hover:underline">
                  Sign up
                </a>
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    );
  }
);

LoginForm.displayName = "LoginForm";

export { LoginForm };
