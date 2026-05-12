export interface ApiError {
  message: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface JobSearchResponse {
  jobId: string;
  title: string;
  description?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  category?: string;
  employmentType?: string;
  postedDate: string;
  viewCount?: number;
  agency?: {
    agencyId: string;
    name: string;
    logo?: string;
  };
}

export interface JobDetailResponse {
  jobId: string;
  title: string;
  description: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  category: string;
  employmentType: string;
  viewCount: number;
  postedDate: string;
  deadlineDate?: string | null;
  applicationCount: number;
  agency: {
    agencyId: string;
    name: string;
    description?: string | null;
    logo?: string | null;
    website?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
  };
}

export interface JobApplicationListResponse {
  applicationId: string;
  jobTitle: string;
  status: string;
  appliedDate: string;
  responseDate?: string | null;
  agencyName?: string | null;
}

export interface SavedJobResponse {
  jobId: string;
  title: string;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  savedDate: string;
  postedDate: string;
}
