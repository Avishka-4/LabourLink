# LabourLink — Migrant Workers Management System

LabourLink is a comprehensive, web-based digital platform that bridges the gap between migrant workers, job seekers, and recruitment agencies. Developed as an academic project at the **Sabaragamuwa University of Sri Lanka**.

---

## 🚀 Project Overview

The platform consolidates fragmented recruitment and worker-welfare workflows into three focused portals:

| Portal | Audience | Key Capabilities |
|--------|----------|-----------------|
| **Worker Portal** | Registered overseas workers | File complaints against agencies, track complaint status, browse government resources |
| **Job Seeker Portal** | Individuals seeking employment abroad | Browse & apply for verified jobs, manage applications, save listings |
| **Agency Portal** | Licensed recruitment agencies | Post & manage job vacancies, review applications, receive & respond to worker complaints |

A public **Landing Page** provides role-based entry points, a news feed, government resource links, and a live **Contact Form** that delivers messages to the platform administrator via **Amazon SES**.

---

## 🛠️ Technology Stack

### Frontend
| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router v7 |
| Notifications | Sonner (toast) |
| Icons | Lucide React |

### Backend
| Layer | Choice |
|-------|--------|
| Framework | ASP.NET Core 8.0 |
| API | REST (Controllers) + GraphQL (HotChocolate) |
| ORM | Entity Framework Core 8 |
| Auth | JWT Bearer + Refresh Tokens, RBAC |

### Infrastructure & Services
| Concern | Choice |
|---------|--------|
| Database | MySQL 8.0+ |
| Transactional Email | **Amazon SES (v2 SDK)** |
| Cloud Hosting | AWS (ECS & S3) |

---

## ✨ Key Features

### 🌐 Three-Language Support
All public-facing content ships with full translations, switchable live from the header:

| Code | Language |
|------|----------|
| `en` | English |
| `si` | සිංහල (Sinhala) |
| `ta` | தமிழ் (Tamil) |

### 🌙 Light / Dark Mode
Every page supports system-aware colour schemes. Users can override the detected preference at any time using the theme toggle in the header — preference is persisted across sessions.

### 📋 Complaint Routing
Workers select a registered agency from a live dropdown when filing a complaint. The complaint is automatically surfaced in that agency's dashboard with no manual routing required.

### 📧 Contact Form via Amazon SES
The landing page contact form sends messages directly to the administrator inbox using the **AWS SES v2 SDK**. The sender's email is set as the reply-to address so replies go straight back to the user.

---

## 🏗️ Project Structure

```
LabourLink/
├── backend-api/                  # ASP.NET Core 8 API
│   ├── Controllers/              # REST endpoints (Worker, Agency, JobSeeker, Contact…)
│   ├── Models/Entities/          # EF Core domain models
│   ├── Models/Enums/             # Shared enumerations
│   ├── Data/                     # DbContext + EF configurations
│   ├── Services/
│   │   ├── Auth/                 # JWT, token refresh, password hashing
│   │   ├── Email/                # IEmailService → Amazon SES implementation
│   │   └── Common/               # Exception middleware, error responses
│   ├── Contracts/                # Request / response DTOs
│   ├── Validators/               # FluentValidation rules
│   └── appsettings.json          # Configuration (Jwt, Cors, Ses, DB)
│
└── src/                          # React + Vite frontend
    ├── app/
    │   ├── pages/                # Landing page (public entry point)
    │   ├── components/           # Shared UI primitives
    │   └── contexts/             # Language context (en / si / ta)
    ├── pages/
    │   ├── worker/               # Worker portal pages
    │   ├── agency/               # Agency portal pages
    │   ├── jobseeker/            # Job seeker portal pages
    │   └── public/               # Login, register, browse jobs (unauthenticated)
    ├── services/                 # API client functions
    └── hooks/useApi.ts           # Authenticated fetch wrapper + token refresh
```

---

## 🏃 Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- MySQL 8.0+

### Run the backend

```bash
cd backend-api
dotnet restore
dotnet run
# API:     http://localhost:5007
# Swagger: http://localhost:5007/swagger
```


---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Worker | `worker@labourlink.demo` | `Worker@123456` |
| Job Seeker | `jobseeker@labourlink.demo` | `Seeker@123456` |
| Agency | `agency@labourlink.demo` | `Agency@123456` |


---

## 👥 Project Team — Group 03

| Member | Responsibilities |
|--------|-----------------|
| **B.K.A.N. Rodrigo** | Database design, API architecture, cloud infrastructure (DevOps) |
| **L.W.S.T. Pushpakumara** | Requirements gathering, sprint management, QA |
| **I. Fathima Nistha** | UI/UX design, frontend implementation, backend integration |

---

## 🎓 Acknowledgements

Special thanks to our supervisor **Mr. Nishankar Sathiyamohan**, Lecturer at the Faculty of Computing, Sabaragamuwa University of Sri Lanka, for his guidance throughout the project.
