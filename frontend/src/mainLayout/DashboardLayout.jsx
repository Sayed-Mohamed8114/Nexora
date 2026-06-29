import SidebarLg from "@/Components/layout/SidebarLg";
import Topbar from "@/Components/layout/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <section>
      <SidebarLg />
      <div className="ms-0 md:ms-[230px]">
        <Topbar />

        <div className="mt-[65px] p-8 bg-primary-section h-[calc(100vh-65px)]">
          {children}
        </div>
      </div>
    </section>
  );
};

export default DashboardLayout;
