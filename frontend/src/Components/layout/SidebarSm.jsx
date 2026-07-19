import { sidebarLinksForAdmin, sidebarLinksForStudent } from "@/constants";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { getCurrentUser } from "@/Services/user";
import { useEffect, useState } from "react";
import SidebarLink from "./SidebarLink";
import Loader from "../Loader/Loader";
import { Menu, X } from "lucide-react";

const SidebarSm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const pathName = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res.success) {
        setUser(res.data);
      }
    });
  }, []);

  useEffect(() => {
    // Close sidebar on path change
    setIsOpen(false);
  }, [pathName]);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("chat_messages");
      localStorage.removeItem("todos");
      navigate("/signin");
    }, 2000);
  };

  return (
    <>
      {loading && <Loader />}

      {/* Hamburger Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-sky-100/80 transition duration-300 cursor-pointer"
        aria-label="Open navigation menu"
      >
        <Menu className="h-6 w-6 text-slate-dark" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-xs md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[120] w-60 p-4 pt-5 bg-linear-to-b from-sky-50 to-sky-100 border-none shadow-2xl flex flex-col gap-5.5 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo and close button */}
        <div className="flex items-center justify-between w-full">
          <Logo />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-sky-200/50 transition duration-300 cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5 text-slate-dark" />
          </button>
        </div>

        {/* Navigation links */}
        <ul className="w-full flex flex-col gap-4 mt-4 overflow-y-auto no-scrollbar flex-1">
          {user.role === "Tutor"
            ? sidebarLinksForAdmin.map((link) => {
                const Icon = link.icon;
                return user ? (
                  <SidebarLink
                    key={link.path}
                    link={link}
                    pathName={pathName}
                    Icon={Icon} 
                  />
                ) : (
                  <div className="animate-pulse bg-slate-light h-10 rounded-lg w-full "></div>
                );
              })
            : sidebarLinksForStudent.map((link) => {
                const Icon = link.icon;
                return user ? (
                  <SidebarLink
                    key={link.path}
                    link={link}
                    pathName={pathName}
                    Icon={Icon}
                  />
                ) : (
                  <div className="animate-pulse bg-slate-light h-10 rounded-lg w-full "></div>
                );
              })}
        </ul>

        {/* Logout button */}
        <div className="mt-auto w-full pt-4 border-t border-sky-200/40">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg cursor-pointer bg-sky-700 text-sky-50 py-2 font-bold text-lg hover:text-white duration-700 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarSm;

