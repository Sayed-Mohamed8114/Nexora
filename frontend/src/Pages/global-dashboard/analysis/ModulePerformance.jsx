import { FilterProvider } from "@/Components/context/FilterContext";
import { useData } from "@/Components/data/useData";
import Loader from "@/Components/Loader/Loader";
import ModulePerformance from "@/Components/pages/ModulePerformance";
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
