import { FilterProvider } from "@/components/context/FilterContext";
import { useData } from "@/components/data/useData";
import Loader from "@/components/Loader/Loader";
import StudentRisk from "@/components/pages/StudentRisk";
import { useOutletContext } from "react-router-dom";

function Studentrisk() {
  const outlet = useOutletContext();
  const fallback = useData();
  const data = outlet?.data ?? fallback.data;
  const loading = outlet ? outlet.loading : fallback.loading;

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <FilterProvider>
      <StudentRisk data={data} />
    </FilterProvider>
  );
}

export default Studentrisk;
