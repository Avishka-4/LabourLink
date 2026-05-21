import { createBrowserRouter } from "react-router";
import { MainLayout } from "@/components";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleProtectedRoute from "@/routes/RoleProtectedRoute";
import { LandingPage } from "./pages/landing";
import WorkerDashboard from "@/pages/worker/WorkerDashboard";
import AgencyDashboard from "@/pages/agency/AgencyDashboard";
import JobSeekerDashboard from "@/pages/jobseeker/JobSeekerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { AgencyLogin } from "./pages/login-agency";
import { WorkerLogin } from "./pages/login-worker";
import { JobSeekerLogin } from "./pages/login-jobseeker";
import { AdminLogin } from "./pages/admin-login";
import { AgencyRegistration } from "./pages/register-agency";
import { WorkerRegistration } from "./pages/register-worker";
import { JobSeekerRegistration } from "./pages/register-jobseeker";
import PublicLandingPage from "@/pages/public/LandingPage";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";
import ForgotPasswordPage from "@/pages/public/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/public/ResetPasswordPage";
import PublicBrowseJobsPage from "@/pages/public/BrowseJobsPage";
import PublicJobDetailPage from "@/pages/public/JobDetailPage";
import PublicNewsPage from "@/pages/public/PublicNewsPage";
import PublicResourcesPage from "@/pages/public/GovernmentResourcesPage";
import PublicNotFoundPage from "@/pages/public/NotFoundPage";
import InfoPage from "@/pages/public/InfoPage";
import MyComplaintsPage from "@/pages/worker/MyComplaintsPage";
import SubmitComplaintPage from "@/pages/worker/SubmitComplaintPage";
import ComplaintDetailPage from "@/pages/worker/ComplaintDetailPage";
import WorkerProfilePage from "@/pages/worker/WorkerProfilePage";
import WorkerSettingsPage from "@/pages/worker/WorkerSettingsPage";
import WorkerResourcesPage from "@/pages/worker/GovernmentResourcesPage";
import JobSeekerBrowseJobsPage from "@/pages/jobseeker/BrowseJobsPage";
import JobSeekerJobDetailPage from "@/pages/jobseeker/JobDetailPage";
import MyApplicationsPage from "@/pages/jobseeker/MyApplicationsPage";
import SavedJobsPage from "@/pages/jobseeker/SavedJobsPage";
import JobSeekerProfilePage from "@/pages/jobseeker/JobSeekerProfilePage";
import JobSeekerSettingsPage from "@/pages/jobseeker/JobSeekerSettingsPage";
import ManageJobsPage from "@/pages/agency/ManageJobsPage";
import PostJobPage from "@/pages/agency/PostJobPage";
import EditJobPage from "@/pages/agency/EditJobPage";
import JobApplicationsPage from "@/pages/agency/JobApplicationsPage";
import AgencyProfilePage from "@/pages/agency/AgencyProfilePage";
import AgencyReportsPage from "@/pages/agency/AgencyReportsPage";
import AgencySettingsPage from "@/pages/agency/AgencySettingsPage";
import ManageUsersPage from "@/pages/admin/ManageUsersPage";
import UserDetailPage from "@/pages/admin/UserDetailPage";
import PendingWorkersPage from "@/pages/admin/PendingWorkersPage";
import PendingAgenciesPage from "@/pages/admin/PendingAgenciesPage";
import JobApprovalsPage from "@/pages/admin/JobApprovalsPage";
import ManageComplaintsPage from "@/pages/admin/ManageComplaintsPage";
import ManageNewsPage from "@/pages/admin/ManageNewsPage";
import CreateNewsPage from "@/pages/admin/CreateNewsPage";
import AuditLogsPage from "@/pages/admin/AuditLogsPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import ForbiddenPage from "@/pages/ErrorPages/ForbiddenPage";
import ErrorPage from "@/pages/ErrorPages/ErrorPage";
import NotFoundPage from "@/pages/ErrorPages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: <PublicLandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPasswordPage />,
  },
  {
    path: "/jobs",
    element: <PublicBrowseJobsPage />,
  },
  {
    path: "/jobs/:id",
    element: <PublicJobDetailPage />,
  },
  {
    path: "/news",
    element: <PublicNewsPage />,
  },
  {
    path: "/resources",
    element: <PublicResourcesPage />,
  },
  {
    path: "/info",
    element: <InfoPage />,
  },
  {
    path: "/login/agency",
    element: <AgencyLogin />,
  },
  {
    path: "/login/worker",
    element: <WorkerLogin />,
  },
  {
    path: "/login/jobseeker",
    element: <JobSeekerLogin />,
  },
  {
    path: "/register/agency",
    element: <AgencyRegistration />,
  },
  {
    path: "/register/worker",
    element: <WorkerRegistration />,
  },
  {
    path: "/register/jobseeker",
    element: <JobSeekerRegistration />,
  },
  {
    path: "/agency",
    element: (
      <ProtectedRoute requiredRole="RecruitmentAgency">
        <AgencyDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/worker",
    element: (
      <ProtectedRoute requiredRole="Worker">
        <WorkerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobseeker",
    element: (
      <ProtectedRoute requiredRole="JobSeeker">
        <JobSeekerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="Administrator">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/worker/complaints",
    element: (
      <ProtectedRoute requiredRole="Worker">
        <MainLayout>
          <MyComplaintsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/worker/complaints/new",
    element: (
      <ProtectedRoute requiredRole="Worker">
        <MainLayout>
          <SubmitComplaintPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/worker/complaints/:id",
    element: (
      <ProtectedRoute requiredRole="Worker">
        <MainLayout>
          <ComplaintDetailPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/worker/profile",
    element: (
      <ProtectedRoute requiredRole="Worker">
        <MainLayout>
          <WorkerProfilePage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/worker/settings",
    element: (
      <ProtectedRoute requiredRole="Worker">
        <MainLayout>
          <WorkerSettingsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/worker/resources",
    element: (
      <ProtectedRoute requiredRole="Worker">
        <MainLayout>
          <WorkerResourcesPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobseeker/jobs",
    element: (
      <ProtectedRoute requiredRole="JobSeeker">
        <MainLayout>
          <JobSeekerBrowseJobsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobseeker/jobs/:id",
    element: (
      <ProtectedRoute requiredRole="JobSeeker">
        <MainLayout>
          <JobSeekerJobDetailPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobseeker/applications",
    element: (
      <ProtectedRoute requiredRole="JobSeeker">
        <MainLayout>
          <MyApplicationsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobseeker/saved-jobs",
    element: (
      <ProtectedRoute requiredRole="JobSeeker">
        <MainLayout>
          <SavedJobsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobseeker/profile",
    element: (
      <ProtectedRoute requiredRole="JobSeeker">
        <MainLayout>
          <JobSeekerProfilePage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobseeker/settings",
    element: (
      <ProtectedRoute requiredRole="JobSeeker">
        <MainLayout>
          <JobSeekerSettingsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/agency/jobs",
    element: (
      <ProtectedRoute requiredRole="RecruitmentAgency">
        <MainLayout>
          <ManageJobsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/agency/jobs/new",
    element: (
      <ProtectedRoute requiredRole="RecruitmentAgency">
        <MainLayout>
          <PostJobPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/agency/jobs/:id/edit",
    element: (
      <ProtectedRoute requiredRole="RecruitmentAgency">
        <MainLayout>
          <EditJobPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/agency/jobs/:id/applications",
    element: (
      <ProtectedRoute requiredRole="RecruitmentAgency">
        <MainLayout>
          <JobApplicationsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/agency/profile",
    element: (
      <ProtectedRoute requiredRole="RecruitmentAgency">
        <MainLayout>
          <AgencyProfilePage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/agency/reports",
    element: (
      <ProtectedRoute requiredRole="RecruitmentAgency">
        <MainLayout>
          <AgencyReportsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/agency/settings",
    element: (
      <ProtectedRoute requiredRole="RecruitmentAgency">
        <MainLayout>
          <AgencySettingsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <RoleProtectedRoute requiredRole="Administrator">
        <MainLayout>
          <ManageUsersPage />
        </MainLayout>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/users/:id",
    element: (
      <RoleProtectedRoute requiredRole="Administrator">
        <MainLayout>
          <UserDetailPage />
        </MainLayout>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/workers/pending",
    element: (
      <RoleProtectedRoute requiredRole="Administrator">
        <MainLayout>
          <PendingWorkersPage />
        </MainLayout>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/agencies/pending",
    element: (
      <RoleProtectedRoute requiredRole="Administrator">
        <MainLayout>
          <PendingAgenciesPage />
        </MainLayout>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/pending",
    element: (
      <RoleProtectedRoute requiredRole="Administrator">
        <MainLayout>
          <JobApprovalsPage />
        </MainLayout>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/complaints",
    element: (
      <RoleProtectedRoute requiredRole="Administrator">
        <MainLayout>
          <ManageComplaintsPage />
        </MainLayout>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/news",
    element: (
      <RoleProtectedRoute requiredRole="Administrator">
        <MainLayout>
          <ManageNewsPage />
        </MainLayout>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/news/new",
    element: (
      <RoleProtectedRoute requiredRole="Administrator">
        <MainLayout>
          <CreateNewsPage />
        </MainLayout>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/audit-logs",
    element: (
      <RoleProtectedRoute requiredRole="Administrator">
        <MainLayout>
          <AuditLogsPage />
        </MainLayout>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <RoleProtectedRoute requiredRole="Administrator">
        <MainLayout>
          <AdminReportsPage />
        </MainLayout>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <RoleProtectedRoute requiredRole="Administrator">
        <MainLayout>
          <AdminSettingsPage />
        </MainLayout>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/403",
    element: <ForbiddenPage />,
  },
  {
    path: "/500",
    element: <ErrorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/fallback",
    element: <PublicNotFoundPage />,
  },
]);