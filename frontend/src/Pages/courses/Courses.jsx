import MainHeading from "@/Components/layout/MainHeading";
import DashboardLayout from "@/mainLayout/DashboardLayout";
import React from "react";

const Courses = () => {
  return (
    <DashboardLayout>
      <MainHeading
        title="Courses"
        description="Here's an overview of your courses"
      />
    </DashboardLayout>
  );
};

export default Courses;
