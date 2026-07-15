import { FilterProvider } from "@/components/context/FilterContext";
import { useData } from "@/components/data/useData";
import Loader from "@/Components/Loader/Loader";
import ModulePerformance from "@/components/pages/ModulePerformance";

function ModulePerfo() {
  const { data, loading } = useData();

  if (loading) {
    return <Loader />;
  }

  return (
    <FilterProvider>
      <ModulePerformance data={data} />
    </FilterProvider>
  );
}

export default ModulePerfo;