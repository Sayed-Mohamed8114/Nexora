import DashboardLayout from "@/mainLayout/DashboardLayout";
import MainHeading from "@/Components/layout/MainHeading";
import React from "react";

const Profile = () => {
  return (
    <DashboardLayout>
      <MainHeading
        title="Profile"
        description="Here's an overview of your profile"
      />
    </DashboardLayout>
  );
};

export default Profile;
