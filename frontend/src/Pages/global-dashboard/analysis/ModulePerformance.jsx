import { FilterProvider } from "@/components/context/FilterContext";
import { useData } from "@/components/data/useData";
import Loader from "@/components/Loader/Loader";
import ModulePerformance from "@/components/pages/ModulePerformance";
import { useOutletContext } from "react-router-dom";

function ModulePerfo() {
  const outlet = useOutletContext();
  const fallback = useData();
  const data = outlet?.data ?? fallback.data;
  const loading = outlet ? outlet.loading : fallback.loading;

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <FilterProvider>
      <ModulePerformance data={data} />
    </FilterProvider>
  );
}

export default ModulePerfo;
