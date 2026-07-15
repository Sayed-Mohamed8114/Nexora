import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-title">{d.name}</p>
      <p className="text-body">
        x: {d.x} · y: {d.y}
      </p>
    </div>
  );
}

export default function NexScatter({
  data,
  title,
  xLabel,
  yLabel,
}) {
  return (
    <div className=" p-5 rounded-2xl bg-transparent">
      <h3 className="mb-4 text-sm font-semibold text-title">{title}</h3>

      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          <XAxis
            dataKey="x"
            type="number"
            name={xLabel}
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
            label={{
              value: xLabel,
              position: "insideBottom",
              offset: -18,
              fontSize: 12,
              fill: "#475569",
              fontWeight: 600,
            }}
          />

          <YAxis
            dataKey="y"
            type="number"
            name={yLabel}
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              offset: 4,
              fontSize: 12,
              fill: "#475569",
              fontWeight: 600,
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Scatter data={data} fill="#009EF7">
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.color}
                r={12}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}