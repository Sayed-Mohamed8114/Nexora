import { sidebarLinks } from "@/constants";
import { NavLink, useLocation } from "react-router-dom";
// import Logo from "./Logo";

const SidebarLg = () => {
  const pathName = useLocation();
  return (
    <aside className="hidden md:block fixed top-0 left-0 h-screen w-[230px] p-4 bg-white border-e border-e-[#C3C6D7] shadow-sm">
      {/* <Logo /> */}
      <ul className="flex flex-col gap-4 mt-4">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 py-2.5 px-3 transition-colors rounded-lg cursor-pointer ${pathName.pathname === link.path ? "bg-primary" : "hover:bg-primary/10"}`}
            >
              <Icon
                className={`${pathName.pathname === link.path ? "text-white " : "text-dark"} h-5 w-5`}
              />
              <p
                className={`text-nav ${pathName.pathname === link.path ? "text-white font-medium" : "text-slate-dark font-bold"}`}
              >
                {link.label}
              </p>
            </NavLink>
          );
        })}
      </ul>
    </aside>
  );
};

export default SidebarLg;
