import ReportCard from "@/Components/layout/ReportCard";
import Loader from "@/Components/Loader/Loader";
import DashboardLayout from "@/mainLayout/DashboardLayout";
import { getReports } from "@/Services/reports";
import { useEffect, useState } from "react";


const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } finally {
      setLoading(false);
    }
  };

  const onsubmitted = async () => {
    const data = await getReports();
    setReports(data);
  };

  useEffect(() => {
    loadReports();
  }, []);
  if (loading) {
    return <Loader />;
  }
  return (
    <DashboardLayout>
      <div className="flex flex-wrap items-center gap-5 w-full mt-10">
        {" "}
        {reports.map((report) => (
          <ReportCard
            key={`${report.codeModule}-${report.codePresentation}`}
            report={report}
            loadReports={loadReports}
            onSubmitted={onsubmitted}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
