import SideBarSm from "./SidebarSm";
import { getCurrentUser } from "../../Services/user";
import { useEffect, useState } from "react";

const Topbar = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res.success) setUser(res.data);
    });
  }, []);
  return (
    <header className="z-40 flex justify-between items-center fixed top-0 left-0 right-0 md:left-55 shadow-md h-16 px-4 md:px-6 bg-linear-to-r from-sky-50 to-sky-100">
      <SideBarSm />

      <div className="flex items-center gap-4 ml-auto">
        {/* User info + avatar */}
        {user && user.firstName ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-black text-nav font-semibold leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-black text-label font-normal">{user.role}</p>
            </div>
            <div className="w-8 h-8 bg-sky-900 rounded-sm text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
              {user.firstName?.charAt(0).toUpperCase()}
              {user.lastName?.charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-sky-900 rounded-sm flex items-center justify-center">
            <span className="animate-ping h-2.5 w-2.5 rounded-full bg-sky-200"></span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;

