import DashboardLayout from "@/mainLayout/DashboardLayout";
import MainHeading from "@/Components/layout/MainHeading";
import React from "react";

const Settings = () => {
  return (
    <DashboardLayout>
      <MainHeading
        title="Settings"
        description="Here's an overview of your settings"
      />
    </DashboardLayout>
  );
};

export default Settings;
