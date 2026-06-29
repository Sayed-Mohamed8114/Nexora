import SideBarSm from "./SidebarSm";

const Topbar = () => {
  return (
    <header className="z-100 flex justify-between items-center fixed top-0 left-0 md:left-[230px] border-b border-b-[#C3C6D7] shadow-sm h-16 px-3 md:px-6 bg-white w-full">
      <SideBarSm />

      <div className="flex items-center gap-4 absolute top-1/2 right-1 md:right-[260px] -translate-y-1/2">
        {/* <img
          src="/assets/icons/notification.svg"
          alt="notification"
          className="w-6 h-6 cursor-pointer"
        /> */}
        {/* User info + avatar */}
        <div className=" flex items-center gap-3">
          <div>
            <p className="text-black text-nav font-semibold">Mahmoud Sayed</p>
            <p className="text-black text-label font-normal ">Admin</p>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-sm text-[10px] font-bold text-white flex items-center justify-center">
            MA
          </div>
          {/* <img src="/assets/images/avatar.png" alt="avatar" className="w-12 h-12 rounded-full" /> */}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
