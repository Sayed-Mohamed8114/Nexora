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
import Settings from "@/Pages/settings/Settings";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<GlobalDashboard />} />
        <Route path="/my-dashboard" element={<MyDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/recommendations" element={<Recommendation />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
