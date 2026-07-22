import { FilterProvider } from "@/components/context/FilterContext";
import { useData } from "@/components/data/useData";
import AcademicPerformance from "@/components/pages/AcademicPerformance";
import Loader from "@/components/Loader/Loader";
import { useOutletContext } from "react-router-dom";

function AnalyticsDashboard() {
  const outlet = useOutletContext();
  const fallback = useData();
  const data = outlet?.data ?? fallback.data;
  const loading = outlet ? outlet.loading : fallback.loading;

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <FilterProvider>
      <AcademicPerformance data={data} />
    </FilterProvider>
  );
}

export default AnalyticsDashboard;
