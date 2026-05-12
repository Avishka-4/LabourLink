import * as React from "react";
import { Input } from "../common/Input";
import { TextArea } from "../common/TextArea";
import { Button } from "../common/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../common/Card";

export interface JobApplicationFormData {
  coverLetter: string;
  resume?: File;
  additionalInfo?: string;
}

export interface JobApplicationFormProps {
  jobTitle: string;
  onSubmit: (data: JobApplicationFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const JobApplicationForm = React.forwardRef<HTMLFormElement, JobApplicationFormProps>(
  ({
    jobTitle,
    onSubmit,
    isLoading = false,
    error,
  }, ref) => {
    const [formData, setFormData] = React.useState<JobApplicationFormData>({
      coverLetter: "",
      resume: undefined,
      additionalInfo: "",
    });
    const [errors, setErrors] = React.useState<Partial<JobApplicationFormData>>({});
    const resumeInputRef = React.useRef<HTMLInputElement>(null);

    const validateForm = () => {
      const newErrors: Partial<JobApplicationFormData> = {};

      if (!formData.coverLetter.trim()) {
        newErrors.coverLetter = "Cover letter is required";
      } else if (formData.coverLetter.trim().length < 50) {
        newErrors.coverLetter = "Cover letter must be at least 50 characters";
      }

      if (!formData.resume) {
        newErrors.resume = "Resume is required";
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
          <CardTitle>Apply for: {jobTitle}</CardTitle>
          <CardDescription>
            Submit your application for this position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={ref} onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <TextArea
              id="coverLetter"
              label="Cover Letter"
              placeholder="Tell us why you're a great fit for this role..."
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              error={errors.coverLetter as string}
              maxLength={1000}
              showCounter
              required
              disabled={isLoading}
            />

            <div>
              <label className="text-sm font-medium">Resume/CV *</label>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFormData({ ...formData, resume: e.target.files[0] });
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className="mt-2 flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2v16M7 13l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {formData.resume ? formData.resume.name : "Upload Resume"}
              </button>
              {errors.resume && (
                <p className="text-xs text-destructive mt-1">{errors.resume as string}</p>
              )}
            </div>

            <TextArea
              id="additionalInfo"
              label="Additional Information (Optional)"
              placeholder="Anything else you'd like us to know?"
              value={formData.additionalInfo || ""}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              maxLength={500}
              showCounter
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
);

JobApplicationForm.displayName = "JobApplicationForm";

export { JobApplicationForm };
