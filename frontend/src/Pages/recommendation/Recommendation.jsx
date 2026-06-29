import DashboardLayout from "@/mainLayout/DashboardLayout";
import MainHeading from "@/Components/layout/MainHeading";
import React from "react";

const Recommendation = () => {
  return (
    <DashboardLayout>
      <MainHeading
        title="Recommendation"
        description="Here's an overview of your recommendations"
      />
    </DashboardLayout>
  );
};

export default Recommendation;
