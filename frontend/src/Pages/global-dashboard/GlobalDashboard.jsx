import MainHeading from "@/Components/layout/MainHeading";
import DashboardLayout from "@/mainLayout/DashboardLayout";

const GlobalDashboard = () => {
  return (
    <DashboardLayout>
      <MainHeading
        title="Welcome Back, Mahmoud"
        description="Here's an overview of your account"
      />
    </DashboardLayout>
  );
};

export default GlobalDashboard;
