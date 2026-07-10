import SideBarSm from "./SidebarSm";
import { getCurrentUser } from "../../Services/user";
import { useEffect, useState } from "react";

const Topbar = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res) setUser(res);
    });
  }, []);
  return (
    <header className="z-100 flex justify-between items-center fixed top-0 left-0 
    md:left-50 shadow-md h-16 px-3 md:px-6 
    bg-linear-to-r from-sky-50 to-sky-100 w-full">
      <SideBarSm />

      <div className="flex  items-center gap-4 absolute top-1/2 right-1 md:right-65 -translate-y-1/2">
        {/* <img
          src="/assets/icons/notification.svg"
          alt="notification"
          className="w-6 h-6 cursor-pointer"
        /> */}
        {/* User info + avatar */}
        {user ? (
          <div className="flex items-center gap-3">
            <div>
              <p className="text-black text-nav font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-black text-label font-normal ">{user.role}</p>
            </div>
            <div className="w-8 h-8 bg-sky-900 rounded-sm text-[10px] font-bold text-white flex items-center justify-center">
              {user.firstName?.charAt(0).toUpperCase()}{" "}
              {user.lastName?.charAt(0).toUpperCase()}
            </div>
            {/* <img src="/assets/images/avatar.png" alt="avatar" className="w-12 h-12 rounded-full" /> */}
          </div>
        ) : (
          <div className="w-8 h-8 bg-sky-900 rounded-sm flex items-center justify-center">
            <span className="animate-ping"></span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
