import { FilterProvider } from "@/components/context/FilterContext";
import { useData } from "@/components/data/useData";
import Loader from "@/Components/Loader/Loader";
import PlatformSuccess from "@/components/pages/PlatformSuccess";

function Platformsuccess() {
  const { data, loading } = useData();

  if (loading) {
    return <Loader />;
  }

  return (
    <FilterProvider>
      <PlatformSuccess data={data} />
    </FilterProvider>
  );
}

export default Platformsuccess;