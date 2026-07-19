import { useState } from "react";
import WaterfallChart from "./computeWaterfallData";

const options = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 14 days", value: "14d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 3 months", value: "90d" },
  { label: "All time", value: "all" },
];

function ProgressCard() {
  const [range, setRange] = useState("30d");

  return (
    <div className="bg-linear-to-b from-sky-900 to-sky-600 w-full lg:w-sm h-auto flex flex-col items-center justify-start py-2 px-2.5 rounded-b-2xl rounded-2xl">
      <div className=" flex items-center justify-between w-full">
        <h3 className="text-sky-50 font-bold text-2xl">Progress</h3>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-md mb-2  p-1.5 text-sky-900 font-bold bg-sky-50 outline-none"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="border-0"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full p-1 h-[30vh] items-center justify-center flex">
        <div className="w-full h-full items-center justify-center flex">
          <WaterfallChart />
        </div>
      </div>
    </div>
  );
}

export default ProgressCard;
