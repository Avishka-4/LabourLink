# LabourLink — Technical Specification

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Backend API](#3-backend-api)
4. [GraphQL API](#4-graphql-api)
5. [REST API Reference](#5-rest-api-reference)
6. [Frontend](#6-frontend)
7. [Database](#7-database)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Data Models](#9-data-models)
10. [Dependencies](#10-dependencies)

---

## 1. Project Overview

**LabourLink** is a full-stack recruitment and migrant worker management platform connecting migrant workers, job seekers, recruitment agencies, and administrators. The system is built on a hybrid REST + GraphQL API architecture.

| Property | Value |
|---|---|
| Platform | Web |
| API Style | REST + GraphQL |
| Frontend URL (dev) | `http://localhost:5173` |
| Backend URL (dev) | `http://localhost:5000` / `https://localhost:5001` |
| GraphQL Playground | `http://localhost:5000/graphql` |
| Swagger UI | `http://localhost:5000/swagger` |

---

## 2. Architecture

```
┌────────────────────────────────────────────────────────┐
│                  React + TypeScript Frontend             │
│                   Vite  ·  Tailwind CSS                 │
└────────────────┬──────────────────┬────────────────────┘
                 │ REST (fetch)      │ GraphQL (fetch POST)
                 ▼                  ▼
┌────────────────────────────────────────────────────────┐
│                ASP.NET Core 8.0 Backend                 │
│  ┌─────────────────────────┐  ┌──────────────────────┐ │
│  │   REST Controllers       │  │  GraphQL (HotChoc.)  │ │
│  │  /api/auth              │  │  /graphql            │ │
│  │  /api/jobs              │  │  - jobs              │ │
│  │  /api/jobseeker         │  │  - job               │ │
│  │  /api/worker            │  │  - news              │ │
│  │  /api/agency            │  │  - newsArticle       │ │
│  │  /api/admin             │  └──────────────────────┘ │
│  │  /api/news              │                            │
│  └─────────────────────────┘                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Entity Framework Core 8  ·  Repository Pattern  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌──────────────────────┐
              │   MySQL 8.0+         │
              │   localhost:3306     │
              │   db: labourlink     │
              └──────────────────────┘
```

**Patterns used:**
- Repository Pattern + Unit of Work (generic `IRepository<T>`, `IUnitOfWork`)
- Role-Based Access Control (4 roles, policy-based authorization)
- JWT Bearer authentication with refresh token rotation
- FluentValidation for request validation
- Centralized exception handling middleware
- Audit timestamps on all entities via `IAuditableEntity`

---

## 3. Backend API

| Property | Value |
|---|---|
| Framework | ASP.NET Core 8.0 |
| Language | C# 12 (.NET 8.0) |
| Target Framework | `net8.0` |
| Nullable | Enabled |
| Implicit Usings | Enabled |

### NuGet Packages

| Package | Version | Purpose |
|---|---|---|
| `Microsoft.AspNetCore.OpenApi` | 8.0.6 | OpenAPI / Swagger spec generation |
| `Swashbuckle.AspNetCore` | 6.6.2 | Swagger UI |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | 8.0.6 | JWT bearer authentication |
| `Microsoft.EntityFrameworkCore` | 8.0.6 | ORM |
| `Microsoft.EntityFrameworkCore.Design` | 8.0.6 | EF Core CLI tooling (design-time) |
| `MySql.EntityFrameworkCore` | 8.0.5 | MySQL EF Core provider |
| `BCrypt.Net-Next` | 4.0.3 | Password hashing (bcrypt) |
| `FluentValidation.AspNetCore` | 11.3.0 | Request model validation |
| `HotChocolate.AspNetCore` | 13.9.14 | GraphQL server |

---

## 4. GraphQL API

**Endpoint:** `POST /graphql`  
**Playground (Banana Cake Pop):** `GET /graphql` in browser  
**Library:** HotChocolate 13.9.14  
**Access:** Public (no authentication required)

The GraphQL API provides read-only access to published jobs and published news articles, supporting filtering and offset-based pagination.

### Schema

```graphql
type Query {
  jobs(
    search: String
    category: String
    location: String
    employmentType: EmploymentType
    page: Int = 1
    pageSize: Int = 10
  ): JobsResult!

  job(id: UUID!): Job

  news(
    category: NewsCategory
    page: Int = 1
    pageSize: Int = 10
  ): NewsResult!

  newsArticle(id: UUID!): NewsArticle
}

type Job {
  id: UUID!
  title: String!
  description: String!
  category: String
  employmentType: EmploymentType!
  location: String!
  country: String
  salaryMin: Decimal
  salaryMax: Decimal
  salaryCurrency: String
  requirements: [String!]!
  requiredExperience: Int
  educationRequired: String
  applicationDeadline: Date
  isFeatured: Boolean!
  postedAt: DateTime!
  viewCount: Int!
  applyCount: Int!
}

type JobsResult {
  items: [Job!]!
  total: Int!
  page: Int!
  pageSize: Int!
  totalPages: Int!
}

type NewsArticle {
  id: UUID!
  title: String!
  content: String!
  category: NewsCategory!
  priority: Priority!
  featuredImageUrl: String
  publishedAt: DateTime
  viewCount: Int!
}

type NewsResult {
  items: [NewsArticle!]!
  total: Int!
  page: Int!
  pageSize: Int!
  totalPages: Int!
}

enum EmploymentType { FULL_TIME PART_TIME CONTRACT TEMPORARY }
enum NewsCategory  { UPDATE ALERT ANNOUNCEMENT POLICY }
enum Priority      { LOW MEDIUM HIGH CRITICAL }
```

### Example Queries

```graphql
# Search published jobs with pagination
query {
  jobs(search: "driver", location: "Colombo", page: 1, pageSize: 5) {
    total
    totalPages
    items {
      id
      title
      employmentType
      salaryMin
      salaryMax
      salaryCurrency
      postedAt
    }
  }
}

# Get a single job
query {
  job(id: "3fa85f64-5717-4562-b3fc-2c963f66afa6") {
    id
    title
    description
    requirements
    applicationDeadline
  }
}

# List news by category
query {
  news(category: ALERT) {
    total
    items {
      id
      title
      publishedAt
    }
  }
}

# Get a single news article
query {
  newsArticle(id: "3fa85f64-5717-4562-b3fc-2c963f66afa6") {
    id
    title
    content
    category
    priority
  }
}
```

---

## 5. REST API Reference

All REST endpoints are prefixed with `/api`. JWT Bearer token required unless marked **Public**.

### Auth — `/api/auth` (Public)

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user (Worker / JobSeeker / Agency) |
| POST | `/auth/login` | Login; returns JWT + refresh token |
| POST | `/auth/refresh-token` | Rotate refresh token; returns new JWT pair |
| POST | `/auth/logout` | Revoke refresh token |
| POST | `/auth/forgot-password` | Send password reset email |
| POST | `/auth/reset-password` | Reset password using emailed token |

### Jobs — `/api/jobs` (Public)

| Method | Path | Description |
|---|---|---|
| GET | `/jobs` | Get published jobs (search, page, pageSize) |
| GET | `/jobs/{jobId}` | Get single job; increments view count |

### News — `/api/news` (Public)

| Method | Path | Description |
|---|---|---|
| GET | `/news` | Get all published news articles |

### Job Seeker — `/api/jobseeker` (Role: JobSeeker)

| Method | Path | Description |
|---|---|---|
| GET | `/jobseeker/profile` | Get own profile |
| PUT | `/jobseeker/profile` | Update own profile |
| GET | `/jobseeker/jobs` | Search available jobs |
| GET | `/jobseeker/jobs/{jobId}` | Get job details |
| POST | `/jobseeker/jobs/{jobId}/apply` | Apply to a job |
| GET | `/jobseeker/applications` | List all own applications |
| GET | `/jobseeker/applications/{applicationId}` | Get application detail |
| POST | `/jobseeker/saved-jobs` | Save a job |
| GET | `/jobseeker/saved-jobs` | List saved jobs |

### Worker — `/api/worker` (Role: Worker)

| Method | Path | Description |
|---|---|---|
| GET | `/worker/profile` | Get own profile |
| PUT | `/worker/profile` | Update own profile |
| POST | `/worker/complaints` | File a complaint |
| GET | `/worker/complaints` | List own complaints |
| GET | `/worker/complaints/{complaintId}` | Get complaint detail |
| PUT | `/worker/complaints/{complaintId}` | Update own complaint |

### Agency — `/api/agency` (Role: RecruitmentAgency)

| Method | Path | Description |
|---|---|---|
| GET | `/agency/profile` | Get own agency profile |
| PUT | `/agency/profile` | Update own agency profile |
| POST | `/agency/jobs` | Create a job posting |
| PUT | `/agency/jobs/{jobId}` | Update a job posting |
| GET | `/agency/jobs` | List all agency job postings |
| GET | `/agency/jobs/{jobId}` | Get job posting detail |
| GET | `/agency/jobs/{jobId}/applications` | List applications for a job |
| PUT | `/agency/applications/{applicationId}` | Update application status |
| GET | `/agency/statistics` | Agency dashboard statistics |

### Admin — `/api/admin` (Role: Administrator)

| Method | Path | Description |
|---|---|---|
| GET | `/admin/users` | List all users |
| GET | `/admin/users/{userId}` | Get user detail |
| PUT | `/admin/users/{userId}/status` | Activate / suspend / delete user |
| GET | `/admin/verifications` | List pending verifications |
| PUT | `/admin/verifications/{verificationId}` | Approve or reject verification |
| GET | `/admin/jobs/pending` | List jobs pending approval |
| PUT | `/admin/jobs/{jobId}/approval` | Approve or reject a job posting |
| GET | `/admin/complaints` | List all complaints |
| PUT | `/admin/complaints/{complaintId}/assign` | Assign complaint to admin |
| PUT | `/admin/complaints/{complaintId}/status` | Update complaint status |
| GET | `/admin/news` | List all news (including drafts) |
| POST | `/admin/news` | Create a news article |
| PUT | `/admin/news/{newsId}` | Update a news article |
| PUT | `/admin/news/{newsId}/publish` | Publish a news article |
| GET | `/admin/audit-logs` | View audit trail |
| GET | `/admin/statistics` | System-wide statistics |

---

## 6. Frontend

| Property | Value |
|---|---|
| Framework | React 18.3.1 |
| Language | TypeScript |
| Build Tool | Vite 6.3.5 |
| Package Manager | pnpm |
| Dev Port | 5173 |

### Core Libraries

| Package | Version | Purpose |
|---|---|---|
| `react` | 18.3.1 | UI framework |
| `react-dom` | 18.3.1 | DOM renderer |
| `react-router` | 7.13.0 | Client-side routing |
| `react-hook-form` | 7.55.0 | Form state management & validation |
| `date-fns` | 3.6.0 | Date formatting and arithmetic |

### UI / Styling

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | 4.1.12 | Utility-first CSS framework |
| `@tailwindcss/vite` | 4.1.12 | Vite plugin for Tailwind |
| `@mui/material` | 7.3.5 | Material UI component library |
| `@mui/icons-material` | 7.3.5 | MUI icon set |
| `@emotion/react` | 11.14.0 | CSS-in-JS (MUI peer dependency) |
| `@emotion/styled` | 11.14.1 | Styled components for Emotion |
| `lucide-react` | 0.487.0 | Icon library |
| `clsx` | 2.1.1 | Conditional className utility |
| `tailwind-merge` | 3.2.0 | Merge Tailwind classes without conflicts |
| `class-variance-authority` | 0.7.1 | Component variant management |
| `tw-animate-css` | 1.3.8 | Animation utilities for Tailwind |
| `next-themes` | 0.4.6 | Dark / light theme management |

### Radix UI Primitives

Radix UI provides the unstyled, accessible component layer. All primitives used:

| Package | Version |
|---|---|
| `@radix-ui/react-accordion` | 1.2.3 |
| `@radix-ui/react-alert-dialog` | 1.1.6 |
| `@radix-ui/react-aspect-ratio` | 1.1.2 |
| `@radix-ui/react-avatar` | 1.1.3 |
| `@radix-ui/react-checkbox` | 1.1.4 |
| `@radix-ui/react-collapsible` | 1.1.3 |
| `@radix-ui/react-context-menu` | 2.2.6 |
| `@radix-ui/react-dialog` | 1.1.6 |
| `@radix-ui/react-dropdown-menu` | 2.1.6 |
| `@radix-ui/react-hover-card` | 1.1.6 |
| `@radix-ui/react-label` | 2.1.2 |
| `@radix-ui/react-menubar` | 1.1.6 |
| `@radix-ui/react-navigation-menu` | 1.2.5 |
| `@radix-ui/react-popover` | 1.1.6 |
| `@radix-ui/react-progress` | 1.1.2 |
| `@radix-ui/react-radio-group` | 1.2.3 |
| `@radix-ui/react-scroll-area` | 1.2.3 |
| `@radix-ui/react-select` | 2.1.6 |
| `@radix-ui/react-separator` | 1.1.2 |
| `@radix-ui/react-slider` | 1.2.3 |
| `@radix-ui/react-slot` | 1.1.2 |
| `@radix-ui/react-switch` | 1.1.3 |
| `@radix-ui/react-tabs` | 1.1.3 |
| `@radix-ui/react-toggle` | 1.1.2 |
| `@radix-ui/react-toggle-group` | 1.1.2 |
| `@radix-ui/react-tooltip` | 1.1.8 |

### Data Visualization & Interaction

| Package | Version | Purpose |
|---|---|---|
| `recharts` | 2.15.2 | Chart library (statistics dashboards) |
| `motion` | 12.23.24 | Animation library |
| `react-dnd` | 16.0.1 | Drag and drop |
| `react-dnd-html5-backend` | 16.0.1 | HTML5 backend for react-dnd |
| `embla-carousel-react` | 8.6.0 | Touch-friendly carousel |
| `react-slick` | 0.31.0 | Additional carousel/slider |
| `react-responsive-masonry` | 2.7.1 | Masonry grid layout |
| `react-resizable-panels` | 2.1.7 | Resizable panel layouts |
| `canvas-confetti` | 1.9.4 | Confetti animation |

### Utilities / Other

| Package | Version | Purpose |
|---|---|---|
| `sonner` | 2.0.3 | Toast notifications |
| `cmdk` | 1.1.1 | Command palette |
| `vaul` | 1.1.2 | Drawer / bottom sheet |
| `input-otp` | 1.4.2 | OTP input field |
| `react-day-picker` | 8.10.1 | Date picker calendar |
| `react-popper` | 2.3.0 | Tooltip/popover positioning |
| `@popperjs/core` | 2.11.8 | Popper.js core |

### Build / Dev Tools

| Package | Version | Purpose |
|---|---|---|
| `vite` | 6.3.5 | Build tool and dev server |
| `@vitejs/plugin-react` | 4.7.0 | React Fast Refresh for Vite |
| `autoprefixer` | ^10.5.0 | CSS vendor prefix automation |
| `postcss` | ^8.5.14 | CSS transformation pipeline |

### Path Alias

The `@` alias maps to `./src`, configured in `vite.config.ts`.

### Frontend API Services

Located in `src/services/`. All services use a shared `apiRequest` utility from `src/hooks/useApi.ts` which handles JWT attachment and automatic token refresh.

| Service file | Covers |
|---|---|
| `authService.ts` | register, login, refresh-token, logout, forgot/reset-password |
| `jobService.ts` | public job listing, job detail |
| `jobSeekerService.ts` | job seeker profile, applications, saved jobs |
| `workerService.ts` | worker profile, complaints |
| `agencyService.ts` | agency profile, job postings, applications, statistics |
| `adminService.ts` | users, verifications, approvals, news, audit logs, statistics |
| `newsService.ts` | public news listing |

---

## 7. Database

| Property | Value |
|---|---|
| Engine | MySQL 8.0+ |
| Host | `localhost` |
| Port | `3306` |
| Database name | `labourlink` |
| User | `labour_admin` |
| ORM | Entity Framework Core 8.0.6 |
| Provider | `MySql.EntityFrameworkCore` 8.0.5 |
| Migrations | EF Core migrations in `backend-api/Migrations/` |
| Entity config | Fluent API in `backend-api/Data/Configurations/` |

### Tables / Entities

| Table | Entity Class | Description |
|---|---|---|
| `Users` | `User` | Base user accounts for all roles |
| `Workers` | `Worker` | Migrant worker profiles |
| `JobSeekers` | `JobSeeker` | Job seeker profiles |
| `RecruitmentAgencies` | `RecruitmentAgency` | Agency profiles |
| `JobPostings` | `JobPosting` | Job advertisements |
| `JobApplications` | `JobApplication` | Applications to job postings |
| `WorkerComplaints` | `WorkerComplaint` | Complaints filed by workers |
| `News` | `News` | News and announcements |
| `SavedJobs` | `SavedJob` | Job bookmarks by job seekers |
| `RefreshTokens` | `RefreshToken` | JWT refresh token store |
| `PasswordResetTokens` | `PasswordResetToken` | Password reset token store |
| `AuditLogs` | `AuditLog` | System-wide audit trail |
| `LookupValues` | `LookupValue` | Reference/lookup data |

All entities implement `IAuditableEntity`, which provides `CreatedAt` and `UpdatedAt` timestamps automatically via `DbContext.SaveChangesAsync()`.

---

## 8. Authentication & Authorization

### JWT Configuration

| Setting | Value |
|---|---|
| Issuer | `LabourLink` |
| Audience | `LabourLink` |
| Algorithm | HMAC-SHA256 (`HS256`) |
| Token expiry | 60 minutes |
| Clock skew | 1 minute |
| Refresh token | Stored in DB; rotated on each use |

JWT secret key is configured in `appsettings.json` under `Jwt:Key`. Token is stored in `localStorage` on the frontend (`token` key).

### Authorization Policies

| Policy name | Required role |
|---|---|
| `WorkerOnly` | `Worker` |
| `JobSeekerOnly` | `JobSeeker` |
| `AgencyOnly` | `RecruitmentAgency` |
| `AdminOnly` | `Administrator` |

### CORS

Allowed origins (configurable via `appsettings.json → Cors:AllowedOrigins`):

```
http://localhost:5173
```

Credentials, any header, any method are allowed from permitted origins.

---

## 9. Data Models

### Enums

| Enum | Values |
|---|---|
| `UserRole` | `Worker`, `JobSeeker`, `RecruitmentAgency`, `Administrator` |
| `UserStatus` | `Active`, `Inactive`, `Suspended`, `Deleted` |
| `VerificationStatus` | `Pending`, `Verified`, `Rejected` |
| `JobStatus` | `Draft`, `Published`, `Closed`, `Expired` |
| `ApplicationStatus` | `Pending`, `Shortlisted`, `Rejected`, `Accepted`, `Withdrawn` |
| `EmploymentType` | `FullTime`, `PartTime`, `Contract`, `Temporary` |
| `ComplaintType` | `Salary`, `Safety`, `Harassment`, `Other` |
| `ComplaintStatus` | `Submitted`, `UnderReview`, `Resolved`, `Closed` |
| `EducationLevel` | `Primary`, `Secondary`, `Tertiary`, `Vocational`, `Other` |
| `Gender` | `Male`, `Female`, `Other` |
| `NewsCategory` | `Update`, `Alert`, `Announcement`, `Policy` |
| `Priority` | `Low`, `Medium`, `High`, `Critical` |

---

## 10. Dependencies

### Full Backend Dependency Tree

```
ASP.NET Core 8.0
├── Microsoft.AspNetCore.OpenApi         8.0.6
├── Swashbuckle.AspNetCore               6.6.2
├── Microsoft.AspNetCore.Authentication.JwtBearer  8.0.6
├── Microsoft.EntityFrameworkCore        8.0.6
├── Microsoft.EntityFrameworkCore.Design 8.0.6  (design-time)
├── MySql.EntityFrameworkCore            8.0.5
├── BCrypt.Net-Next                      4.0.3
├── FluentValidation.AspNetCore          11.3.0
└── HotChocolate.AspNetCore              13.9.14
```

### Full Frontend Dependency Tree

```
React 18.3.1
├── react-router              7.13.0
├── react-hook-form           7.55.0
├── date-fns                  3.6.0
│
├── UI / Styling
│   ├── tailwindcss           4.1.12
│   ├── @mui/material         7.3.5
│   ├── @mui/icons-material   7.3.5
│   ├── @emotion/react        11.14.0
│   ├── @emotion/styled       11.14.1
│   ├── lucide-react          0.487.0
│   ├── clsx                  2.1.1
│   ├── tailwind-merge        3.2.0
│   ├── class-variance-authority  0.7.1
│   ├── next-themes           0.4.6
│   └── tw-animate-css        1.3.8
│
├── Radix UI Primitives       (23 packages, v1.x–2.x)
│
├── Data & Interaction
│   ├── recharts              2.15.2
│   ├── motion                12.23.24
│   ├── react-dnd             16.0.1
│   ├── embla-carousel-react  8.6.0
│   ├── react-slick           0.31.0
│   └── react-responsive-masonry  2.7.1
│
└── Utilities
    ├── sonner                2.0.3
    ├── cmdk                  1.1.1
    ├── vaul                  1.1.2
    ├── input-otp             1.4.2
    └── react-day-picker      8.10.1
```
