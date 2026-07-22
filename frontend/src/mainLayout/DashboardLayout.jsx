import SidebarLg from "@/Components/layout/SidebarLg";
import Topbar from "@/Components/layout/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <section className="overflow-x-hidden">
      <SidebarLg />
      <div className="ms-0 md:ms-55 w-full overflow-x-hidden md:w-[calc(100%-12.5rem)]">
        <Topbar />

        <div className="pt-20 px-4 pb-7 md:p-8 md:pt-20 bg-linear-to-r from-sky-50 to-sky-200 min-h-screen flex flex-col"> 
          {children}
        </div>
      </div>
    </section>
  );
};

export default DashboardLayout;
