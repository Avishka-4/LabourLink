# .NET Backend Development Roadmap

This document outlines the steps to build the .NET backend for the LabourLink application using REST APIs, and setting up CI/CD pipelines for automated deployment.



## 1. Project Initialization (Completed)

- Set up a new .NET solution with separate projects for the API, Core Logic, and Data Access.
- The following projects have been created:
    - `LabourLink.Api`
    - `LabourLink.Core`
    - `LabourLink.Infrastructure`

## 2. Database Schema and Models

- **Define Entities**: Create C# classes in `LabourLink.Core/Models` that represent the database tables:
    - `User.cs`
    - `Worker.cs`
    - `JobSeeker.cs`
    - `Agency.cs`
    - `Job.cs`
    - `Complaint.cs`
- **Configure DbContext**: Set up the `DbContext` in `LabourLink.Infrastructure/Data` to manage the connection to the database and define table relationships.
- **Install EF Core**: Add the necessary Entity Framework Core NuGet packages to the `LabourLink.Infrastructure` project.
- **Create Initial Migration**: Use the `dotnet ef migrations add InitialCreate` command to generate the initial database schema.
- **Update Database**: Apply the migration to the database using `dotnet ef database update`.

## 3. API Layer (REST)

- **REST API Scaffolding**:
    - **Create Controllers**: In `LabourLink.Api/Controllers`, create API controllers for standard CRUD operations on each major entity (e.g., `UsersController`, `JobsController`).

## 4. Authentication and Authorization

- **Implement JWT Authentication**: Secure your REST endpoints using JSON Web Tokens.
- **Set Up Role-Based Access Control (RBAC)**: Ensure users can only access resources and perform actions appropriate for their roles (Worker, Agency, Admin).

## 5. Business Logic and Services

- **Create Service Interfaces**: Define interfaces for your services in `LabourLink.Core/Services`.
- **Implement Service Logic**: Write the business logic for your application in service classes. This logic will be consumed by both your REST controllers and your GraphQL resolvers.

## 6. Frontend Integration

- **Configure CORS**: Enable Cross-Origin Resource Sharing (CORS) in `LabourLink.Api` to allow your React frontend to communicate with the backend.
- **Connect Frontend**:
    - **REST**: Use a library like `axios` for simple data fetching from REST endpoints.

## 7. CI/CD Pipeline Setup

- **Choose a Platform**: Select a CI/CD provider like GitHub Actions, Azure DevOps, or Jenkins.
- **Create Build Pipeline**:
    - **Frontend**: Configure a pipeline to install dependencies (`npm install`) and build your React application (`npm run build`).
    - **Backend**: Configure a pipeline to restore dependencies (`dotnet restore`) and build your .NET solution (`dotnet build`).
- **Create Release Pipeline**:
    - **Automate Deployment**: Set up a release pipeline to automatically deploy your frontend to a static hosting service (like AWS S3 or Vercel) and your backend to a hosting service (like AWS ECS or Azure App Service).
- **Testing**: Integrate automated tests into your pipeline to ensure code quality before deployment.


-------------------------------------------------------------

✅ COMPLETED (Beyond the original 10):

Database Models - All entities defined
Authentication Endpoints - Register, Login, RefreshToken, Logout
Auth Services - AuthService, TokenService, PasswordHashService
Error Handling - ExceptionHandlingMiddleware & ErrorResponse
Auth DTOs - Auth contracts

⏳ STILL TODO (From your original 10):
High Priority (Core Infrastructure):

✅ Create Repository Pattern - Partially done, but formalize it
Create all DTOs/Contracts for Worker, JobSeeker, Agency, Admin portals
Create FluentValidation validators for all request DTOs
✅ Update AuthController - You have basic auth; add forgot/reset password endpoints
Create Worker Portal Controller and Services
Create JobSeeker Portal Controller and Services
Create Recruitment Agency Portal Controller and Services
Create Admin Portal Controller and Services
Update Program.cs with full service registration and middleware
Setup Swagger/OpenAPI and Serilog logging

🔴 CRITICAL NEXT STEPS:

Repository Pattern - Create generic IRepository<T> and Unit of Work if not done
DTOs for all portals - Define request/response contracts for each portal
FluentValidation - Validators for all DTOs
Portal Controllers & Services - Implement each portal's business logic
Program.cs Configuration - Register all services, middleware, add Swagger & Serilog



-----------------------------------------------------


-----------------------------------------------------

## Post-Update Roadmap (Completion + CI/CD + Hosting)

### Phase A - Backend Finish
- Implement business logic for Worker/JobSeeker/Agency/Admin endpoints (replace 501 scaffolds).
- Align DTOs with entities or add missing entities (SavedJob, Documents, etc.).
- Add paging/filtering/sorting to list endpoints and return consistent pagination metadata.
- Add migrations for new entities (PasswordResetToken and any new tables) and verify repeatability.
- Add seed data for lookup tables and add indexes for common query paths.

### Phase B - Frontend Integration
- Finish auth flow UI (login/logout/refresh, role-based redirects).
- Replace remaining mock data with real API calls across pages.
- Add error handling, empty states, and loading states for API calls.


wire frontend pages to APIs 
Clean up mock data files 
Validate end to end flows
mailtrap intergration to the website and use a carousal to the website 

Status:
Frontend: running at http://localhost:5173
Backend: running at http://localhost:5007
Build warnings remain (nullability), but they do not stop the API from running.
Next steps if you want:

Start MySQL (I didn’t find a Windows service named MySQL; if you use XAMPP/WAMP, start it there).
Hit the API Swagger at http://localhost:5007/swagger in a browser to confirm endpoints.


### Phase C - Testing
- Backend unit tests for services (extend coverage beyond auth).
- Backend integration tests for controllers and auth flows.
- Frontend smoke tests for login, role routing, and jobs list.

### Phase D - Environment & Security
- Move secrets to environment variables or secret manager (JWT key, DB credentials).
- Add appsettings.Production.json and environment-based configuration.
- Add centralized logging (Serilog) and health checks.

### Phase E - CI/CD (GitHub Actions recommended)
- CI: restore/build/test for backend and frontend on PRs.
- CD: build artifacts, run tests, and deploy on main branch.
- Database: apply migrations automatically on deploy with rollback strategy.

### Phase F - Hosting (Pick a target stack)
- Backend hosting: Azure App Service / AWS ECS / Render / Railway.
- Database hosting: Azure Database for MySQL / AWS RDS / PlanetScale.
- Frontend hosting: Vercel / Netlify / Azure Static Web Apps.
- Configure DNS, SSL, and environment variables in hosting dashboards.


