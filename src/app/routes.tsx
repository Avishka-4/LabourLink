import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing";
import { AgencyDashboard } from "./pages/agency-dashboard";
import { WorkerDashboard } from "./pages/worker-dashboard";
import { JobSeekerDashboard } from "./pages/jobseeker-dashboard";
import { AdminDashboard } from "./pages/admin-dashboard-new";
import { AgencyLogin } from "./pages/login-agency";
import { WorkerLogin } from "./pages/login-worker";
import { JobSeekerLogin } from "./pages/login-jobseeker";
import { AdminLogin } from "./pages/admin-login";
import { AgencyRegistration } from "./pages/register-agency";
import { WorkerRegistration } from "./pages/register-worker";
import { JobSeekerRegistration } from "./pages/register-jobseeker";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
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
    element: <AgencyDashboard />,
  },
  {
    path: "/worker",
    element: <WorkerDashboard />,
  },
  {
    path: "/jobseeker",
    element: <JobSeekerDashboard />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
]);