import { createBrowserRouter } from "react-router";
import { MainLayout } from "@/components";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { LandingPage } from "./pages/landing";
import WorkerDashboard from "@/pages/worker/WorkerDashboard";
import AgencyDashboard from "@/pages/agency/AgencyDashboard";
import JobSeekerDashboard from "@/pages/jobseeker/JobSeekerDashboard";
import { AgencyLogin } from "./pages/login-agency";
import { WorkerLogin } from "./pages/login-worker";
import { JobSeekerLogin } from "./pages/login-jobseeker";
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
import WorkerResourcesPage from "@/pages/worker/GovernmentResourcesPage";
import WorkerBrowseJobsPage from "@/pages/worker/WorkerBrowseJobsPage";
import WorkerJobDetailPage from "@/pages/worker/WorkerJobDetailPage";
import WorkerMyApplicationsPage from "@/pages/worker/WorkerMyApplicationsPage";
import JobSeekerBrowseJobsPage from "@/pages/jobseeker/BrowseJobsPage";
import JobSeekerJobDetailPage from "@/pages/jobseeker/JobDetailPage";
import MyApplicationsPage from "@/pages/jobseeker/MyApplicationsPage";
import SavedJobsPage from "@/pages/jobseeker/SavedJobsPage";
import JobSeekerProfilePage from "@/pages/jobseeker/JobSeekerProfilePage";
import ManageJobsPage from "@/pages/agency/ManageJobsPage";
import PostJobPage from "@/pages/agency/PostJobPage";
import EditJobPage from "@/pages/agency/EditJobPage";
import JobApplicationsPage from "@/pages/agency/JobApplicationsPage";
import AgencyProfilePage from "@/pages/agency/AgencyProfilePage";
import AgencyReportsPage from "@/pages/agency/AgencyReportsPage";
import AgencyComplaintsPage from "@/pages/agency/AgencyComplaintsPage";
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
    path: "/worker/jobs",
    element: (
      <ProtectedRoute requiredRole="Worker">
        <MainLayout>
          <WorkerBrowseJobsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/worker/jobs/:id",
    element: (
      <ProtectedRoute requiredRole="Worker">
        <MainLayout>
          <WorkerJobDetailPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/worker/applications",
    element: (
      <ProtectedRoute requiredRole="Worker">
        <MainLayout>
          <WorkerMyApplicationsPage />
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
    path: "/agency/complaints",
    element: (
      <ProtectedRoute requiredRole="RecruitmentAgency">
        <MainLayout>
          <AgencyComplaintsPage />
        </MainLayout>
      </ProtectedRoute>
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