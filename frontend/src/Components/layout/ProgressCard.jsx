import WaterfallChart from "./computeWaterfallData";

function ProgressCard({ data }) {

  return (
    <div className="flex h-auto min-h-80 w-full flex-col items-center justify-start rounded-md bg-linear-to-b from-sky-900 to-sky-600 px-2.5 py-2 lg:max-w-sm">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold text-sky-50 sm:text-2xl">Progress</h3>
       
      </div>
      <div className="flex h-65 w-full items-center justify-center p-1 sm:h-[30vh]">
        <WaterfallChart data={data} />
      </div>
    </div>
  );
}

export default ProgressCard;
