import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

function computeWaterfallData(rawData) {
  let runningTotal = 0;

  return rawData.map((entry) => {
    const { value, isTotal = false } = entry;
    let barBottom;
    let barTop;

    if (isTotal) {
      barBottom = 0;
      barTop = value;
    } else if (value >= 0) {
      barBottom = runningTotal;
      barTop = runningTotal + value;
    } else {
      barBottom = runningTotal + value;
      barTop = runningTotal;
    }

    if (!isTotal) {
      runningTotal += value;
    }

    return {
      name: entry.name,
      value,
      waterfallRange: [barBottom, barTop],
      isTotal,
    };
  });
}

const defaultRawData = [
  { name: "Completed", value: 4 },
  { name: "Current", value: 3 },
  { name: "Remaining", value: 1 },
  { name: "Total", value: 8, isTotal: true },
];

function getBarColor(entry) {
  if (entry?.isTotal) return "#082f49";
  if (entry?.value >= 0) return "#bae6fd";
  return "#f0f9ff";
}

const WaterfallBar = (props) => (
  <Rectangle {...props} fill={getBarColor(props.payload)} radius={[8, 8, 0, 0]} />
);

const WaterfallTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const entry = payload[0].payload;

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 px-4 py-3">
      <p className="font-bold text-sky-950">{entry.name}</p>
      <p className="text-gray-600">
        Value: {entry.value >= 0 ? "+" : ""}
        {entry.value}
      </p>
      {entry.isTotal && <p className="text-sky-700 font-semibold italic">Total</p>}
    </div>
  );
};

export default function WaterfallChart({ data }) {
  const rawData = data?.length ? data : defaultRawData;
  const waterfallData = computeWaterfallData(rawData);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={waterfallData}
        margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
      >
        <CartesianGrid stroke="#ffffff30" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#ffffff", fontWeight: 600, fontSize: 12 }}
          axisLine={{ stroke: "#ffffff" }}
          tickLine={false}
        />
        <YAxis tick={{ fill: "#ffffff", fontWeight: 600 }} axisLine={false} tickLine={false} />
        <Tooltip content={<WaterfallTooltip />} />
        <Bar
          dataKey={(item) => item.waterfallRange}
          shape={(props) => <WaterfallBar {...props} />}
          isAnimationActive={true}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
