import * as React from "react";
import { Input } from "../common/Input";
import { TextArea } from "../common/TextArea";
import { Button } from "../common/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../common/Card";
import { Badge } from "../common/Badge";

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  avatar?: File;
  skills?: string[];
}

export interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => Promise<void>;
  initialData?: Partial<ProfileFormData>;
  isLoading?: boolean;
  error?: string;
  showSkills?: boolean;
}

const ProfileForm = React.forwardRef<HTMLFormElement, ProfileFormProps>(
  ({
    onSubmit,
    initialData,
    isLoading = false,
    error,
    showSkills = false,
  }, ref) => {
    const [formData, setFormData] = React.useState<ProfileFormData>({
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      bio: initialData?.bio || "",
      location: initialData?.location || "",
      avatar: initialData?.avatar,
      skills: initialData?.skills || [],
    });
    const [errors, setErrors] = React.useState<Partial<ProfileFormData>>({});
    const [skillInput, setSkillInput] = React.useState("");
    const avatarInputRef = React.useRef<HTMLInputElement>(null);

    const validateForm = () => {
      const newErrors: Partial<ProfileFormData> = {};

      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";

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

    const addSkill = () => {
      if (skillInput.trim()) {
        setFormData({
          ...formData,
          skills: [...(formData.skills || []), skillInput.trim()],
        });
        setSkillInput("");
      }
    };

    const removeSkill = (skill: string) => {
      setFormData({
        ...formData,
        skills: (formData.skills || []).filter((s) => s !== skill),
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={ref} onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Avatar */}
            <div>
              <label className="text-sm font-medium">Profile Picture</label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {formData.avatar ? (
                    <img
                      src={URL.createObjectURL(formData.avatar)}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFormData({ ...formData, avatar: e.target.files[0] });
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-3 py-2 border border-input rounded-md text-sm hover:bg-muted transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                error={errors.firstName as string}
                required
                disabled={isLoading}
              />

              <Input
                id="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                error={errors.lastName as string}
                required
                disabled={isLoading}
              />
            </div>

            <Input
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email as string}
              required
              disabled={isLoading}
            />

            <Input
              id="phone"
              label="Phone"
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isLoading}
            />

            <Input
              id="location"
              label="Location"
              placeholder="City, Country"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={isLoading}
            />

            <TextArea
              id="bio"
              label="Bio"
              placeholder="Tell us about yourself"
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              maxLength={500}
              showCounter
              disabled={isLoading}
            />

            {showSkills && (
              <div>
                <label className="text-sm font-medium">Skills</label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Add
                  </Button>
                </div>

                {formData.skills && formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.map((skill) => (
                      <Badge
                        key={skill}
                        onRemove={() => removeSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
);

ProfileForm.displayName = "ProfileForm";

export { ProfileForm };
