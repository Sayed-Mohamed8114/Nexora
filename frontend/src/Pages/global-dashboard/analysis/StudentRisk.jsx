import { FilterProvider } from "@/components/context/FilterContext";
import { useData } from "@/components/data/useData";
import Loader from "@/Components/Loader/Loader";
import StudentRisk from "@/components/pages/StudentRisk";

function Studentrisk() {
  const { data, loading } = useData();

  if (loading) {
    return <Loader />;
  }

  return (
    <FilterProvider>
      <StudentRisk data={data} />
    </FilterProvider>
  );
}

export default Studentrisk;