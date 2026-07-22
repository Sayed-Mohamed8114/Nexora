import { FilterProvider } from "@/components/context/FilterContext";
import { useData } from "@/components/data/useData";
import AcademicPerformance from "@/components/pages/AcademicPerformance";
import Loader from "@/Components/Loader/Loader";

function AnalyticsDashboard() {
  const { data, loading } = useData();

  if (loading) {
    return <Loader />;
  }

  return (
    <FilterProvider>
      <AcademicPerformance data={data} />
    </FilterProvider>
  );
}

export default AnalyticsDashboard;