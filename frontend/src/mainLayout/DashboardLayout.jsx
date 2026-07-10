import SidebarLg from "@/Components/layout/SidebarLg";
import Topbar from "@/Components/layout/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <section>
      <SidebarLg />
      <div className="ms-0 md:ms-50 w-full overflow-x-hidden md:w-[calc(100%-12.5rem)]">
        <Topbar />

        <div className="mt-16.25 p-8 bg-linear-to-r from-sky-50 to-sky-200 min-h-[calc(100vh-65px)] h-auto">
          {children}
        </div>
      </div>
    </section>
  );
};

export default DashboardLayout;
