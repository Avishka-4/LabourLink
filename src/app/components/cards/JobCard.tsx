import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  applicants?: number;
  posted?: Date;
  onApply?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isLoading?: boolean;
}

const JobCard = React.forwardRef<HTMLDivElement, JobCardProps>(
  ({
    id,
    title,
    company,
    location,
    jobType,
    salaryMin,
    salaryMax,
    description,
    applicants,
    posted,
    onApply,
    onSave,
    isSaved = false,
    isLoading = false,
  }, ref) => {
    const formatSalary = () => {
      if (!salaryMin || !salaryMax) return null;
      return `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`;
    };

    const formatDate = (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) return "Today";
      if (days === 1) return "Yesterday";
      if (days < 7) return `${days} days ago`;
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
      return `${Math.floor(days / 30)} months ago`;
    };

    return (
      <Card ref={ref} variant="outline" hoverable className="overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-grow">
              <CardTitle className="line-clamp-2">{title}</CardTitle>
              <CardDescription>{company}</CardDescription>
            </div>
            <button
              type="button"
              onClick={onSave}
              disabled={isLoading}
              className="p-2 hover:bg-muted rounded transition-colors"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isSaved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              </svg>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {jobType && <Badge variant="secondary" size="sm">{jobType}</Badge>}
            {formatSalary() && <Badge variant="success" size="sm">{formatSalary()}</Badge>}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" />
              </svg>
              {location}
            </div>
            {applicants !== undefined && (
              <div className="flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 21H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                {applicants} applicants
              </div>
            )}
            {posted && (
              <div>
                Posted {formatDate(posted)}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onApply}
              disabled={isLoading}
            >
              Apply Now
            </Button>
            <a
              href={`/job/${id}`}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              View Details
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }
);

JobCard.displayName = "JobCard";

export { JobCard };
