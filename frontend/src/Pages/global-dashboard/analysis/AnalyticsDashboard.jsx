import { FilterProvider } from "@/Components/context/FilterContext";
import { useData } from "@/Components/data/useData";
import AcademicPerformance from "@/Components/pages/AcademicPerformance";
import Loader from "@/Components/Loader/Loader";
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
