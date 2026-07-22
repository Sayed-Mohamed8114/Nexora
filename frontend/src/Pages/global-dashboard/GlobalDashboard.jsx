import { useEffect, useState } from "react";
import DashboardLayout from "@/mainLayout/DashboardLayout";
import { NavLink, Outlet } from "react-router-dom";
import MainChart from "@/Components/layout/MainChart";
import { getCurrentUser } from "@/Services/user";
import {
  buildAnalyticsData,
  getDashboardByRole,
  getMainChartData,
  normalizeDashboardResponse,
} from "@/Services/dashboard";

const GlobalDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const userRes = await getCurrentUser();
        if (!userRes?.success) return;

        const role = userRes.data?.role;
        const dashboardRes = await getDashboardByRole(role);
        const dashboard = normalizeDashboardResponse(dashboardRes);

        setUserRole(role);
        setDashboardData(dashboard);
        setChartData(getMainChartData(dashboard, role));
        setAnalyticsData(buildAnalyticsData(dashboard, role));
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const navlinkStyle = ({ isActive }) =>
    `
    p-2.5 rounded-md duration-700 font-bold text-lg transition whitespace-nowrap
    ${
      isActive
        ? "bg-sky-600 text-sky-50"
        : "hover:bg-sky-600 hover:text-sky-50"
    }
    `;

  return (
    <DashboardLayout>
      <nav
        className="
          w-full rounded-md mt-1
          bg-white/40 px-4 py-2.5
          shadow-xl shadow-sky-900/10
          backdrop-blur
          md:px-7
          flex items-center justify-start md:justify-between gap-3
          overflow-x-auto no-scrollbar flex-nowrap
        "
      >
        <NavLink className={navlinkStyle} to="academic-performance">
          Academic Performance
        </NavLink>

        <NavLink className={navlinkStyle} to="executive-overview">
          Executive Overview
        </NavLink>

        <NavLink className={navlinkStyle} to="student-risk">
          Student Risk
        </NavLink>

        <NavLink className={navlinkStyle} to="platform-success">
          Platform Success
        </NavLink>

        <NavLink className={navlinkStyle} to="module-performance">
          Module Performance
        </NavLink>
      </nav>

      <div className="mt-5 border-white/70 shadow-xl shadow-sky-900/10 backdrop-blur text-sky-950 p-5 rounded-xl">
        <h2 className="font-extrabold text-2xl mb-3 text-sky-950 font-sans">
          My Performance Overview
        </h2>
        <div className="w-full">
          <MainChart data={chartData} />
        </div>
      </div>

      <div className="mt-5">
        <Outlet
          context={{
            data: analyticsData,
            dashboardData,
            chartData,
            role: userRole,
            loading,
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default GlobalDashboard;
