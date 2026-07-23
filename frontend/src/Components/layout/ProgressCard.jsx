import { useState } from "react";
import WaterfallChart from "./computeWaterfallData";

const options = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 14 days", value: "14d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 3 months", value: "90d" },
  { label: "All time", value: "all" },
];

function ProgressCard({ data }) {
  const [range, setRange] = useState("30d");

  return (
    <div className="flex h-auto min-h-[320px] w-full flex-col items-center justify-start rounded-md bg-linear-to-b from-sky-900 to-sky-600 px-2.5 py-2 lg:max-w-sm">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold text-sky-50 sm:text-2xl">Progress</h3>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="w-full rounded-md bg-sky-50 p-1.5 font-bold text-sky-900 outline-none sm:w-auto"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="border-0">
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex h-[260px] w-full items-center justify-center p-1 sm:h-[30vh]">
        <WaterfallChart data={data} />
      </div>
    </div>
  );
}

export default ProgressCard;
