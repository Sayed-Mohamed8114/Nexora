import { FilterProvider } from "@/components/context/FilterContext";
import { useData } from "@/components/data/useData";
import Loader from "@/Components/Loader/Loader";
import ExecutiveOverview from "@/components/pages/ExecutiveOverview";

function Overview() {
  const { data, loading } = useData();

  if (loading) {
    return <Loader />;
  }

  return (
    <FilterProvider>
      <ExecutiveOverview data={data} />
    </FilterProvider>
  );
}

export default Overview;