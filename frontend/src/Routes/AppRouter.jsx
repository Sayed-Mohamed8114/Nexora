import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../Pages/Home";
import Signin from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";

import GlobalDashboard from "@/Pages/global-dashboard/GlobalDashboard";
import MyDashboard from "@/Pages/my-dashboard/MyDashboard";
import Profile from "@/Pages/profile/Profile";
import Courses from "@/Pages/courses/Courses";
import Recommendation from "@/Pages/recommendation/Recommendation";
import Reports from "@/Pages/reports/Reports";

// Analysis Pages
import AcademicPerformance from "@/Pages/global-dashboard/analysis/AnalyticsDashboard";
import Overview from "@/Pages/global-dashboard/analysis/ExecutiveOverview";
import ModulePerfo from "@/Pages/global-dashboard/analysis/ModulePerformance";
import Platformsuccess from "@/Pages/global-dashboard/analysis/PlatformSuccess";
import Studentrisk from "@/Pages/global-dashboard/analysis/StudentRisk";
import MyCourses from "@/Pages/my-courses/MyCourses";
import Notification from "@/Pages/notification/Notification";




export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Student Dashboard */}
        <Route path="/dashboard" element={<MyDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/recommendations" element={<Recommendation />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/mycourses" element={<MyCourses />} />
        <Route path="/notification" element={<Notification />} />

        {/* Global Dashboard */}
        <Route path="/GlobalDashboard" element={<GlobalDashboard />}>
          <Route index element={<AcademicPerformance />} />

          <Route
            path="academic-performance"
            element={<AcademicPerformance />}
          />
          <Route path="executive-overview" element={<Overview />} />

          <Route path="student-risk" element={<Studentrisk />} />

          <Route path="platform-success" element={<Platformsuccess />} />

          <Route path="module-performance" element={<ModulePerfo />} />
        </Route>



        {/* Authentication */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
