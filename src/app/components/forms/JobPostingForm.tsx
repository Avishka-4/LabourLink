import * as React from "react";
import { X, Plus, Briefcase, MapPin, DollarSign, Clock, Calendar, Star, ChevronDown } from "lucide-react";

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

const PRESET_BENEFITS = [
  "Health Insurance",
  "Dental Insurance",
  "Retirement Plan",
  "Remote Work",
  "Flexible Hours",
  "Training & Development",
  "Transport Allowance",
  "Meal Allowance",
  "Accommodation",
  "Annual Bonus",
  "Overtime Pay",
  "Paid Leave",
];

const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "any", label: "Any Level" },
];

function SectionHeader({ icon: Icon, title, subtitle, color }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-3 pb-3 border-b ${color}`}>
      <div className={`p-2 rounded-lg bg-current/10`}>
        <Icon className={`size-4`} />
      </div>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white text-sm">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

function Field({ label, required, error, hint, children }: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean; prefix?: React.ReactNode }) {
  const { hasError, prefix, className, ...rest } = props;
  if (prefix) {
    return (
      <div className={`flex items-center border rounded-lg overflow-hidden transition-all ${
        hasError
          ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus-within:border-emerald-400 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900/30'
      }`}>
        <span className="px-3 text-gray-400 text-sm border-r border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2.5">{prefix}</span>
        <input
          {...rest}
          className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
        />
      </div>
    );
  }
  return (
    <input
      {...rest}
      className={`w-full px-3 py-2.5 text-sm border rounded-lg transition-all outline-none
        ${hasError
          ? 'border-red-400 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-300'
          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30'
        } placeholder:text-gray-400 ${className ?? ''}`}
    />
  );
}

function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }) {
  const { hasError, className, ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full px-3 py-2.5 text-sm border rounded-lg transition-all outline-none resize-none
        ${hasError
          ? 'border-red-400 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-300'
          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30'
        } placeholder:text-gray-400 ${className ?? ''}`}
    />
  );
}

function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) {
  const { hasError, className, children, ...rest } = props;
  return (
    <div className="relative">
      <select
        {...rest}
        className={`w-full px-3 py-2.5 text-sm border rounded-lg transition-all outline-none appearance-none pr-8
          ${hasError
            ? 'border-red-400 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-300'
            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30'
          } ${className ?? ''}`}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
    </div>
  );
}

const JobPostingForm = React.forwardRef<HTMLFormElement, JobPostingFormProps>(
  ({ onSubmit, initialData, isLoading = false, error }, ref) => {
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
    const [errors, setErrors] = React.useState<Partial<Record<keyof JobPostingFormData, string>>>({});
    const [customBenefit, setCustomBenefit] = React.useState("");

    React.useEffect(() => {
      if (initialData) {
        setFormData(prev => ({ ...prev, ...initialData }));
      }
    }, [initialData?.title]);

    const validate = () => {
      const e: Partial<Record<keyof JobPostingFormData, string>> = {};
      if (!formData.title.trim()) e.title = "Job title is required";
      if (!formData.company.trim()) e.company = "Company name is required";
      if (!formData.description.trim()) e.description = "Description is required";
      if (!formData.requirements.trim()) e.requirements = "Requirements are required";
      if (!formData.location.trim()) e.location = "Location is required";
      return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
      setErrors({});
      try { await onSubmit(formData); } catch { /* handled by parent */ }
    };

    const toggleBenefit = (label: string) => {
      setFormData(prev => ({
        ...prev,
        benefits: prev.benefits.includes(label)
          ? prev.benefits.filter(b => b !== label)
          : [...prev.benefits, label],
      }));
    };

    const addCustomBenefit = () => {
      const val = customBenefit.trim();
      if (!val || formData.benefits.includes(val)) return;
      setFormData(prev => ({ ...prev, benefits: [...prev.benefits, val] }));
      setCustomBenefit("");
    };

    const removeBenefit = (label: string) => {
      setFormData(prev => ({ ...prev, benefits: prev.benefits.filter(b => b !== label) }));
    };

    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-white/20 p-2 rounded-lg">
              <Briefcase className="size-5" />
            </div>
            <h2 className="text-xl font-bold">{initialData?.title ? 'Edit Job Posting' : 'Create Job Posting'}</h2>
          </div>
          <p className="text-emerald-100 text-sm">Fill in the details to attract the right candidates</p>
        </div>

        <form ref={ref} onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-start gap-2">
              <span className="text-red-500 font-bold flex-shrink-0">!</span>
              {error}
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-lg">
                <Briefcase className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Job Details</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Basic information about the position</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Job Title" required error={errors.title}>
                <StyledInput
                  placeholder="e.g., Housekeeping Supervisor"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  hasError={!!errors.title}
                  disabled={isLoading}
                />
              </Field>
              <Field label="Company / Agency Name" required error={errors.company}>
                <StyledInput
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  hasError={!!errors.company}
                  disabled={isLoading}
                />
              </Field>
            </div>

            <Field label="Job Description" required error={errors.description} hint="Describe the role, responsibilities, and what a typical day looks like">
              <StyledTextarea
                placeholder="Describe the role and responsibilities in detail..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                hasError={!!errors.description}
                rows={5}
                disabled={isLoading}
              />
            </Field>

            <Field label="Requirements" required error={errors.requirements} hint="List required qualifications, skills, and experience">
              <StyledTextarea
                placeholder="e.g., Minimum 2 years experience, Valid passport, Good communication skills..."
                value={formData.requirements}
                onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                hasError={!!errors.requirements}
                rows={4}
                disabled={isLoading}
              />
            </Field>
          </div>

          {/* Section 2: Location & Type */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg">
                <MapPin className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Location & Employment</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Location" required error={errors.location}>
                <StyledInput
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  hasError={!!errors.location}
                  disabled={isLoading}
                  prefix={<MapPin className="size-3.5 text-gray-400" />}
                />
              </Field>

              <Field label="Job Type">
                <StyledSelect
                  value={formData.jobType}
                  onChange={e => setFormData({ ...formData, jobType: e.target.value })}
                  disabled={isLoading}
                >
                  {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </StyledSelect>
              </Field>

              <Field label="Experience Level">
                <StyledSelect
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="">Any level</option>
                  {EXPERIENCE_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </StyledSelect>
              </Field>
            </div>
          </div>

          {/* Section 3: Salary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-lg">
                <DollarSign className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Salary Range</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Monthly salary in LKR (optional)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Minimum Salary">
                <StyledInput
                  type="number"
                  placeholder="e.g., 30000"
                  value={formData.salaryMin}
                  onChange={e => setFormData({ ...formData, salaryMin: e.target.value })}
                  disabled={isLoading}
                  prefix="LKR"
                />
              </Field>
              <Field label="Maximum Salary">
                <StyledInput
                  type="number"
                  placeholder="e.g., 60000"
                  value={formData.salaryMax}
                  onChange={e => setFormData({ ...formData, salaryMax: e.target.value })}
                  disabled={isLoading}
                  prefix="LKR"
                />
              </Field>
            </div>
          </div>

          {/* Section 4: Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-lg">
                <Star className="size-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Benefits & Perks</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Click to toggle — or add your own below</p>
              </div>
            </div>

            {/* Preset pill toggles */}
            <div className="flex flex-wrap gap-2">
              {PRESET_BENEFITS.map(label => {
                const selected = formData.benefits.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleBenefit(label)}
                    disabled={isLoading}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all select-none ${
                      selected
                        ? 'bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-200 dark:shadow-purple-900/30'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 dark:hover:border-purple-500 dark:hover:text-purple-400'
                    }`}
                  >
                    {selected && <span className="mr-1">✓</span>}
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Custom benefit input */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden focus-within:border-purple-400 dark:focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 dark:focus-within:ring-purple-900/30 transition-all bg-white dark:bg-gray-800">
                <Plus className="size-4 text-gray-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Add a custom benefit..."
                  value={customBenefit}
                  onChange={e => setCustomBenefit(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomBenefit(); } }}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                />
              </div>
              <button
                type="button"
                onClick={addCustomBenefit}
                disabled={!customBenefit.trim() || isLoading}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            {/* Selected custom benefits (ones not in preset) */}
            {formData.benefits.filter(b => !PRESET_BENEFITS.includes(b)).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.benefits.filter(b => !PRESET_BENEFITS.includes(b)).map(b => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-full"
                  >
                    {b}
                    <button
                      type="button"
                      onClick={() => removeBenefit(b)}
                      className="hover:bg-purple-500 rounded-full p-0.5 transition"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {formData.benefits.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">No benefits selected yet — click the pills above or add custom ones</p>
            )}
          </div>

          {/* Section 5: Deadline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="bg-rose-100 dark:bg-rose-900/30 p-1.5 rounded-lg">
                <Calendar className="size-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Application Deadline</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Optional — leave blank if rolling applications</p>
              </div>
            </div>
            <Field label="Deadline Date">
              <StyledInput
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                disabled={isLoading}
                min={new Date().toISOString().split('T')[0]}
              />
            </Field>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Briefcase className="size-4" />
                  {initialData?.title ? 'Update Job Posting' : 'Post Job'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }
);

JobPostingForm.displayName = "JobPostingForm";

export { JobPostingForm };