import { FilterProvider } from "@/components/context/FilterContext";
import { useData } from "@/components/data/useData";
import Loader from "@/Components/Loader/Loader";
import ExecutiveOverview from "@/components/pages/ExecutiveOverview";
import { useOutletContext } from "react-router-dom";

function Overview() {
  const outlet = useOutletContext();
  const fallback = useData();
  const data = outlet?.data ?? fallback.data;
  const loading = outlet ? outlet.loading : fallback.loading;

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <FilterProvider>
      <ExecutiveOverview data={data} />
    </FilterProvider>
  );
}

export default Overview;
