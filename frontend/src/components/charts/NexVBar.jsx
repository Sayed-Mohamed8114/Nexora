import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function NexVBar({
  data,
  title,
  color = "#009EF7",
  suffix = "",
  colorMap,
  sortDesc = false,
}) {
  // Sort data if requested
  const processedData = [...data];

  if (sortDesc) {
    processedData.sort((a, b) => b.value - a.value);
  }

  return (
    <div className="p-5 h-auto bg-transparent">
      <h3 className="mb-4 text-sm font-semibold text-title">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 10, bottom: 0, left: -10 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={processedData.length > 8 ? -35 : 0}
            textAnchor={processedData.length > 8 ? "end" : "middle"}
            height={processedData.length > 8 ? 60 : 30}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              fontSize: 12,
            }}
            formatter={(value) => [`${value}${suffix}`, ""]}
          />

          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={36}>
            {processedData.map((entry, i) => {
              const itemColor =
                entry.color ||
                (colorMap && colorMap[entry.name]) ||
                color;

              return <Cell key={i} fill={itemColor} />;
            })}

            <LabelList
              dataKey="value"
              position="top"
              formatter={(value) => `${value}${suffix}`}
              style={{
                fontSize: 11,
                fill: "#0F172A",
                fontWeight: 600,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}