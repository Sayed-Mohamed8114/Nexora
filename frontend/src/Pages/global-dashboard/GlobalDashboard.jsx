import DashboardLayout from "@/mainLayout/DashboardLayout";
import { NavLink, Outlet } from "react-router-dom";

const GlobalDashboard = () => {
  const navlinkStyle = ({ isActive }) =>
    `
    p-2.5 rounded-md duration-700 font-bold text-lg transition
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
          w-full rounded-md h-[6vh] mt-1
          bg-white/40 px-4 py-3
          shadow-xl shadow-sky-900/10
          backdrop-blur
          md:px-7
          flex items-center justify-between gap-3
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