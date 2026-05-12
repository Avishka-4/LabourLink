import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

// Worker Profile Card
export interface WorkerProfileCardProps {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar?: string;
  skills?: string[];
  experience?: string;
  rating?: number;
  verified?: boolean;
  onView?: () => void;
  onHire?: () => void;
}

const WorkerProfileCard = React.forwardRef<HTMLDivElement, WorkerProfileCardProps>(
  ({
    id,
    name,
    title,
    location,
    avatar,
    skills,
    experience,
    rating,
    verified,
    onView,
    onHire,
  }, ref) => (
    <Card ref={ref} variant="outline" hoverable>
      <CardHeader>
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{name}</CardTitle>
              {verified && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
                  <path d="M9 16.17L4.83 12m0 0L3 13.83m1.83-1.83L9 12m0 0l4.17-4.17" />
                </svg>
              )}
            </div>
            <CardDescription>{title}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="2" />
          </svg>
          {location}
        </div>

        {experience && (
          <div className="text-sm">
            <span className="font-medium">{experience}</span>
            <span className="text-muted-foreground"> experience</span>
          </div>
        )}

        {rating && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                stroke="currentColor"
                className="text-yellow-500"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span className="text-sm text-muted-foreground">({rating}/5)</span>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium">Skills</p>
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill) => (
                <Badge key={skill} size="sm" variant="secondary">
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge size="sm" variant="outline">
                  +{skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex-1"
          >
            View Profile
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onHire}
            className="flex-1"
          >
            Hire
          </Button>
        </div>
      </CardContent>
    </Card>
  )
);

WorkerProfileCard.displayName = "WorkerProfileCard";

// Application Card
export interface ApplicationCardProps {
  id: string;
  jobTitle: string;
  applicantName: string;
  applicantAvatar?: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  appliedDate: Date;
  onView?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

const ApplicationCard = React.forwardRef<HTMLDivElement, ApplicationCardProps>(
  ({
    id,
    jobTitle,
    applicantName,
    applicantAvatar,
    status,
    appliedDate,
    onView,
    onAccept,
    onReject,
  }, ref) => {
    const statusStyles = {
      pending: "bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200",
      reviewing: "bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200",
      accepted: "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200",
      rejected: "bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-200",
    };

    return (
      <Card ref={ref} variant="outline">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0">
              {applicantAvatar ? (
                <img src={applicantAvatar} alt={applicantName} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-grow">
              <p className="font-medium">{applicantName}</p>
              <p className="text-sm text-muted-foreground">{jobTitle}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[status]}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Applied {appliedDate.toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-1">
              <Button size="icon-sm" variant="outline" onClick={onView}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </Button>
              {status === "pending" && (
                <>
                  <Button size="icon-sm" variant="ghost" onClick={onAccept}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 16.17L4.83 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={onReject}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ApplicationCard.displayName = "ApplicationCard";

// Complaint Card
export interface ComplaintCardProps {
  id: string;
  title: string;
  type: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  filedDate: Date;
  onView?: () => void;
}

const ComplaintCard = React.forwardRef<HTMLDivElement, ComplaintCardProps>(
  ({
    id,
    title,
    type,
    status,
    priority,
    filedDate,
    onView,
  }, ref) => {
    const statusStyles = {
      open: "bg-blue-50 text-blue-900 dark:bg-blue-950",
      "in-progress": "bg-yellow-50 text-yellow-900 dark:bg-yellow-950",
      resolved: "bg-green-50 text-green-900 dark:bg-green-950",
      closed: "bg-gray-50 text-gray-900 dark:bg-gray-950",
    };

    const priorityStyles = {
      low: "text-blue-600",
      medium: "text-yellow-600",
      high: "text-orange-600",
      urgent: "text-red-600",
    };

    return (
      <Card ref={ref} variant="outline" onClick={onView} className="cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              <p className="font-medium line-clamp-1">{title}</p>
              <p className="text-sm text-muted-foreground mt-1">Type: {type}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Filed {filedDate.toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[status]}`}>
                {status}
              </span>
              <span className={`text-xs px-2 py-1 font-medium ${priorityStyles[priority]}`}>
                {priority}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ComplaintCard.displayName = "ComplaintCard";

// Agency Card
export interface AgencyCardProps {
  id: string;
  name: string;
  logo?: string;
  jobsPosted: number;
  certifications?: string[];
  rating?: number;
  onView?: () => void;
}

const AgencyCard = React.forwardRef<HTMLDivElement, AgencyCardProps>(
  ({
    id,
    name,
    logo,
    jobsPosted,
    certifications,
    rating,
    onView,
  }, ref) => (
    <Card ref={ref} variant="outline" hoverable>
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-3 items-start">
          {logo && (
            <img src={logo} alt={name} className="w-12 h-12 rounded-lg" />
          )}
          <div className="flex-grow">
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">{jobsPosted} jobs posted</p>
          </div>
        </div>

        {rating && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "none"}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" />
              </svg>
            ))}
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium">Certifications</p>
            <div className="flex flex-wrap gap-1">
              {certifications.map((cert) => (
                <Badge key={cert} size="sm">{cert}</Badge>
              ))}
            </div>
          </div>
        )}

        <Button variant="outline" size="sm" onClick={onView} className="w-full">
          View Agency
        </Button>
      </CardContent>
    </Card>
  )
);

AgencyCard.displayName = "AgencyCard";

// News Card
export interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  date: Date;
  category: string;
  onRead?: () => void;
}

const NewsCard = React.forwardRef<HTMLDivElement, NewsCardProps>(
  ({
    id,
    title,
    excerpt,
    image,
    date,
    category,
    onRead,
  }, ref) => (
    <Card ref={ref} variant="outline" hoverable onClick={onRead} className="cursor-pointer overflow-hidden flex flex-col">
      {image && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardContent className="pt-4 flex-grow flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Badge size="sm">{category}</Badge>
          <span className="text-xs text-muted-foreground">{date.toLocaleDateString()}</span>
        </div>
        <p className="font-medium line-clamp-2 mb-2">{title}</p>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{excerpt}</p>
        <Button variant="link" size="sm" className="mt-4 p-0">
          Read More →
        </Button>
      </CardContent>
    </Card>
  )
);

NewsCard.displayName = "NewsCard";

export { WorkerProfileCard, ApplicationCard, ComplaintCard, AgencyCard, NewsCard };
