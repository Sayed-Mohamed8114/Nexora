import { sidebarLinksForAdmin, sidebarLinksForStudent } from "@/constants";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { getCurrentUser } from "@/Services/user";
import { useEffect, useState } from "react";
import SidebarLink from "./SidebarLink";
import Loader from "../Loader/Loader";

const SidebarLg = () => {
  const [user, setUser] = useState({});
  const pathName = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res) {
        setUser(res);
      }
    });
  }, []);
  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/signin");
    }, 2000);
  };

  return (
    <>
      {loading && <Loader />}

      <aside className="hidden md:flex md:flex-col md:items-center md:gap-5.5 
       fixed top-0 left-0 h-screen w-50 p-4 pt-5 bg-linear-to-b from-sky-50 to-sky-100 border-none shadow-md">
        <Logo />
        <ul className=" w-full flex flex-col gap-4 mt-4">
          {user.role === "Student"
            ? sidebarLinksForStudent.map((link) => {
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
            : sidebarLinksForAdmin.map((link) => {
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
        <div className="mt-auto w-full ">
          <button
            onClick={handleLogout}
            className="w-full  rounded-lg cursor-pointer bg-sky-700 text-sky-50 py-2 font-bold text-xl hover:text-white duration-700 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarLg;
