import { FilterProvider } from "@/components/context/FilterContext";
import { useData } from "@/components/data/useData";
import Loader from "@/components/Loader/Loader";
import PlatformSuccess from "@/components/pages/PlatformSuccess";
import { useOutletContext } from "react-router-dom";

function Platformsuccess() {
  const outlet = useOutletContext();
  const fallback = useData();
  const data = outlet?.data ?? fallback.data;
  const loading = outlet ? outlet.loading : fallback.loading;

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <FilterProvider>
      <PlatformSuccess data={data} />
    </FilterProvider>
  );
}

export default Platformsuccess;
