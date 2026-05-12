/**
 * LabourLink Component Library - Type Definitions
 * This file contains shared types used across the component library
 */

/**
 * User Role Type
 */
export type UserRole = "worker" | "agency" | "jobseeker" | "admin";

/**
 * API Response Type
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination Info
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Filter Options
 */
export interface FilterOptions {
  search?: string;
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
  pagination?: PaginationInfo;
  filters?: Record<string, any>;
}

/**
 * Form Error Type
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * Status Types
 */
export type Status = "idle" | "loading" | "success" | "error";

/**
 * Severity Types
 */
export type Severity = "low" | "medium" | "high" | "urgent";

/**
 * Notification Type
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

/**
 * Theme Type
 */
export type Theme = "light" | "dark";

/**
 * Size Type
 */
export type Size = "sm" | "md" | "lg" | "xl";

/**
 * Variant Type
 */
export type Variant = "primary" | "secondary" | "danger" | "outline" | "ghost" | "link";

/**
 * Breakpoint Type
 */
export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * Responsive Value
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Form State
 */
export interface FormState<T = any> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * List State
 */
export interface ListState<T = any> {
  data: T[];
  loading: boolean;
  error?: string;
  pagination?: PaginationInfo;
  filters?: FilterOptions;
}

/**
 * Modal State
 */
export interface ModalState {
  isOpen: boolean;
  data?: any;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * Authentication State
 */
export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
  };
  token?: string;
  loading: boolean;
  error?: string;
}

/**
 * Job Posting Type
 */
export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: "full-time" | "part-time" | "contract" | "temporary";
  experience: "entry" | "mid" | "senior" | "any";
  benefits: string[];
  posted: Date;
  deadline?: Date;
  applicants: number;
}

/**
 * Worker Profile Type
 */
export interface WorkerProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  bio?: string;
  avatar?: string;
  skills: string[];
  experience: string;
  verified: boolean;
  rating: number;
  reviews: number;
}

/**
 * Application Type
 */
export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar?: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  appliedDate: Date;
  coverLetter: string;
  resumeUrl: string;
}

/**
 * Complaint Type
 */
export interface Complaint {
  id: string;
  title: string;
  description: string;
  type: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: Severity;
  filedDate: Date;
  resolvedDate?: Date;
  attachments?: string[];
}

/**
 * Agency Type
 */
export interface Agency {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  jobsPosted: number;
  certifications: string[];
  rating: number;
  verified: boolean;
}

/**
 * News/Article Type
 */
export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  published: Date;
  author: string;
  views: number;
}
