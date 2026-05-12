import * as React from "react";
import { Input } from "../common/Input";
import { TextArea } from "../common/TextArea";
import { Button } from "../common/Button";
import { Select, type SelectOption } from "../common/Select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../common/Card";

export interface ComplaintFormData {
  type: string;
  title: string;
  description: string;
  attachments?: File[];
}

export interface ComplaintFormProps {
  onSubmit: (data: ComplaintFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  complaintTypes?: SelectOption[];
}

const ComplaintForm = React.forwardRef<HTMLFormElement, ComplaintFormProps>(
  ({
    onSubmit,
    isLoading = false,
    error,
    complaintTypes = [
      { value: "workplace", label: "Workplace Safety" },
      { value: "wage", label: "Wage Issue" },
      { value: "harassment", label: "Harassment" },
      { value: "discrimination", label: "Discrimination" },
      { value: "other", label: "Other" },
    ],
  }, ref) => {
    const [formData, setFormData] = React.useState<ComplaintFormData>({
      type: "",
      title: "",
      description: "",
      attachments: [],
    });
    const [errors, setErrors] = React.useState<Partial<ComplaintFormData>>({});
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const validateForm = () => {
      const newErrors: Partial<ComplaintFormData> = {};

      if (!formData.type) {
        newErrors.type = "Complaint type is required";
      }
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      }
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      } else if (formData.description.trim().length < 20) {
        newErrors.description = "Description must be at least 20 characters";
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setFormData({
          ...formData,
          attachments: [...(formData.attachments || []), ...newFiles],
        });
      }
    };

    const removeAttachment = (index: number) => {
      setFormData({
        ...formData,
        attachments: formData.attachments?.filter((_, i) => i !== index),
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>File a Complaint</CardTitle>
          <CardDescription>
            Describe your complaint in detail. We will review it promptly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={ref} onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <Select
              label="Complaint Type"
              placeholder="Select complaint type"
              options={complaintTypes}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: String(value) })}
              error={errors.type as string}
              required
              disabled={isLoading}
            />

            <Input
              id="title"
              label="Complaint Title"
              placeholder="Brief summary of your complaint"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title as string}
              required
              disabled={isLoading}
            />

            <TextArea
              id="description"
              label="Detailed Description"
              placeholder="Provide as much detail as possible about your complaint..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description as string}
              maxLength={2000}
              showCounter
              required
              disabled={isLoading}
            />

            <div className="border-2 border-dashed border-border rounded-lg p-6">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 w-full text-center"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-muted-foreground"
                >
                  <path
                    d="M12 2v16M7 13l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG, DOC (max 10MB each)</p>
                </div>
              </button>
            </div>

            {formData.attachments && formData.attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Attachments ({formData.attachments.length})</p>
                <div className="space-y-1">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded bg-muted"
                    >
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Submit Complaint
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
);

ComplaintForm.displayName = "ComplaintForm";

export { ComplaintForm };
