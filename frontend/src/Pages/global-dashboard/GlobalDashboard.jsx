import DashboardLayout from "@/mainLayout/DashboardLayout";
import { NavLink, Outlet } from "react-router-dom";

const GlobalDashboard = () => {
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
        <NavLink 
          className={navlinkStyle} 
          to="academic-performance"
        >
          Academic Performance
        </NavLink>

        <NavLink 
          className={navlinkStyle} 
          to="executive-overview"
        >
          Executive Overview
        </NavLink>

        <NavLink 
          className={navlinkStyle} 
          to="student-risk"
        >
          Student Risk
        </NavLink>

        <NavLink 
          className={navlinkStyle} 
          to="platform-success"
        >
          Platform Success
        </NavLink>

        <NavLink 
          className={navlinkStyle} 
          to="module-performance"
        >
          Module Performance
        </NavLink>
      </nav>

      <div className="mt-5">
        <Outlet />
      </div>
    </DashboardLayout>
  );
};

export default GlobalDashboard;