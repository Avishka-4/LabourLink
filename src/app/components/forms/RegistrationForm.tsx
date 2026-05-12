import * as React from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../common/Card";
import { Select, type SelectOption } from "../common/Select";
import { RadioGroup, type RadioOption } from "../common/RadioGroup";

export type UserRole = "worker" | "agency" | "jobseeker" | "admin";

export interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  userRoles?: UserRole[];
}

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone?: string;
  agreeToTerms: boolean;
}

const RegistrationForm = React.forwardRef<HTMLFormElement, RegistrationFormProps>(
  ({
    onSubmit,
    isLoading = false,
    error,
    userRoles = ["worker", "jobseeker", "agency"],
  }, ref) => {
    const [step, setStep] = React.useState<1 | 2>(1);
    const [formData, setFormData] = React.useState<RegistrationFormData>({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "worker",
      phone: "",
      agreeToTerms: false,
    });
    const [errors, setErrors] = React.useState<Partial<RegistrationFormData>>({});

    const roleOptions: RadioOption[] = [
      { value: "worker", label: "Worker", description: "Looking for work" },
      { value: "jobseeker", label: "Job Seeker", description: "Searching for jobs" },
      { value: "agency", label: "Agency", description: "Recruitment agency" },
    ].filter(r => userRoles.includes(r.value as UserRole));

    const validateStep1 = () => {
      const newErrors: Partial<RegistrationFormData> = {};

      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }

      return newErrors;
    };

    const validateStep2 = () => {
      const newErrors: Partial<RegistrationFormData> = {};

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms";
      }

      return newErrors;
    };

    const handleNext = () => {
      const newErrors = validateStep1();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors = validateStep2();

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
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Step {step} of 2 - {step === 1 ? "Basic Information" : "Account Details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={ref} onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="firstName"
                    label="First Name"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    error={errors.firstName as string}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    id="lastName"
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    error={errors.lastName as string}
                    required
                    disabled={isLoading}
                  />
                </div>

                <RadioGroup
                  label="Account Type"
                  options={roleOptions}
                  value={formData.role}
                  onChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                  required
                />

                <Input
                  id="phone"
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isLoading}
                />
              </>
            ) : (
              <>
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

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-xs text-destructive">{errors.agreeToTerms as string}</p>
                )}
              </>
            )}

            <div className="flex gap-3 pt-4">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {step === 1 ? "Next" : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
);

RegistrationForm.displayName = "RegistrationForm";

export { RegistrationForm };
