import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function MainChart({ data: propData }) {
  const defaultData = [
    { name: "Jan", progress: 4000, study: 2400 },
    { name: "Feb", progress: 3000, study: 1398 },
    { name: "Mar", progress: 2000, study: 9800 },
    { name: "Apr", progress: 2780, study: 3908 },
    { name: "May", progress: 1890, study: 4800 },
    { name: "Jun", progress: 2390, study: 3800 },
    { name: "Jul", progress: 3490, study: 4300 },
  ];

  const data = propData?.length ? propData : defaultData;

  return (
    <div className="h-[320px] min-h-[280px] w-full rounded-md bg-sky-950/90 p-2 shadow-xl sm:h-[40vh]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 12, left: -8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#bae6fd" opacity={0.2} />
          <XAxis
            dataKey="name"
            stroke="#ffffff"
            tick={{ fill: "#ffffff", fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis stroke="#ffffff" tick={{ fill: "#ffffff", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(12.9% 0.042 264.695)",
              borderRadius: "8px",
              border: "none",
              color: "#ffffff",
            }}
          />
          <Legend wrapperStyle={{ color: "#ffffff", fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="progress"
            name="Progress"
            stroke="oklch(90.1% 0.058 230.902)"
            strokeWidth={3}
            dot={{ fill: "#f0f9ff", stroke: "#000000", strokeWidth: 2 }}
            activeDot={{ r: 7, fill: "#075985" }}
          />
          <Line
            type="monotone"
            dataKey="study"
            name="Study Hours"
            stroke="oklch(92.8% 0.006 264.531)"
            strokeWidth={3}
            dot={{ fill: "#f0f9ff", stroke: "#075985", strokeWidth: 2 }}
            activeDot={{ r: 7, fill: "#000000" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MainChart;
