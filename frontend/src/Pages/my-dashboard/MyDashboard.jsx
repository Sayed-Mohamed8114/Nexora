import DashboardLayout from "@/mainLayout/DashboardLayout";
import MainHeading from "@/Components/layout/MainHeading";
import React from "react";

const MyDashboard = () => {
  return (
    <DashboardLayout>
      <MainHeading
        title="My Dashboard"
        description="Here's an overview of your dashboard"
      />
    </DashboardLayout>
  );
};

export default MyDashboard;
