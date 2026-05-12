import * as React from "react";
import { Input } from "../common/Input";
import { TextArea } from "../common/TextArea";
import { Button } from "../common/Button";
import { Select, type SelectOption } from "../common/Select";
import { Checkbox } from "../common/Checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../common/Card";

export interface JobPostingFormData {
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  jobType: string;
  experience: string;
  benefits: string[];
  deadline?: string;
}

export interface JobPostingFormProps {
  onSubmit: (data: JobPostingFormData) => Promise<void>;
  initialData?: Partial<JobPostingFormData>;
  isLoading?: boolean;
  error?: string;
}

const JobPostingForm = React.forwardRef<HTMLFormElement, JobPostingFormProps>(
  ({
    onSubmit,
    initialData,
    isLoading = false,
    error,
  }, ref) => {
    const [formData, setFormData] = React.useState<JobPostingFormData>({
      title: initialData?.title || "",
      company: initialData?.company || "",
      description: initialData?.description || "",
      requirements: initialData?.requirements || "",
      location: initialData?.location || "",
      salaryMin: initialData?.salaryMin || "",
      salaryMax: initialData?.salaryMax || "",
      jobType: initialData?.jobType || "full-time",
      experience: initialData?.experience || "",
      benefits: initialData?.benefits || [],
      deadline: initialData?.deadline || "",
    });
    const [errors, setErrors] = React.useState<Partial<JobPostingFormData>>({});

    const jobTypes: SelectOption[] = [
      { value: "full-time", label: "Full-time" },
      { value: "part-time", label: "Part-time" },
      { value: "contract", label: "Contract" },
      { value: "temporary", label: "Temporary" },
    ];

    const experienceLevels: SelectOption[] = [
      { value: "entry", label: "Entry Level" },
      { value: "mid", label: "Mid Level" },
      { value: "senior", label: "Senior" },
      { value: "any", label: "Any Level" },
    ];

    const benefitsOptions = [
      { id: "health", label: "Health Insurance" },
      { id: "dental", label: "Dental Insurance" },
      { id: "retirement", label: "Retirement Plan" },
      { id: "remote", label: "Remote Work" },
      { id: "flexible", label: "Flexible Hours" },
      { id: "training", label: "Training & Development" },
    ];

    const validateForm = () => {
      const newErrors: Partial<JobPostingFormData> = {};

      if (!formData.title.trim()) newErrors.title = "Job title is required";
      if (!formData.company.trim()) newErrors.company = "Company name is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (!formData.requirements.trim()) newErrors.requirements = "Requirements are required";
      if (!formData.location.trim()) newErrors.location = "Location is required";

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
          <CardTitle>Create Job Posting</CardTitle>
          <CardDescription>Fill in all the details about the job position</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={ref} onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="title"
                label="Job Title"
                placeholder="e.g., Senior Software Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={errors.title as string}
                required
                disabled={isLoading}
              />

              <Input
                id="company"
                label="Company Name"
                placeholder="Your company name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                error={errors.company as string}
                required
                disabled={isLoading}
              />
            </div>

            <TextArea
              id="description"
              label="Job Description"
              placeholder="Describe the role and responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description as string}
              required
              disabled={isLoading}
            />

            <TextArea
              id="requirements"
              label="Requirements"
              placeholder="List required skills and qualifications..."
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              error={errors.requirements as string}
              required
              disabled={isLoading}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="location"
                label="Location"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                error={errors.location as string}
                required
                disabled={isLoading}
              />

              <Select
                label="Job Type"
                options={jobTypes}
                value={formData.jobType}
                onChange={(value) => setFormData({ ...formData, jobType: String(value) })}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                id="salaryMin"
                label="Min Salary"
                type="number"
                placeholder="0"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                disabled={isLoading}
              />

              <Input
                id="salaryMax"
                label="Max Salary"
                type="number"
                placeholder="0"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                disabled={isLoading}
              />

              <Select
                label="Experience Level"
                options={experienceLevels}
                value={formData.experience}
                onChange={(value) => setFormData({ ...formData, experience: String(value) })}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Benefits</label>
              <div className="space-y-2">
                {benefitsOptions.map((benefit) => (
                  <Checkbox
                    key={benefit.id}
                    id={benefit.id}
                    label={benefit.label}
                    checked={formData.benefits.includes(benefit.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          benefits: [...formData.benefits, benefit.id],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          benefits: formData.benefits.filter((b) => b !== benefit.id),
                        });
                      }
                    }}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            <Input
              id="deadline"
              label="Application Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Post Job
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
);

JobPostingForm.displayName = "JobPostingForm";

export { JobPostingForm };
