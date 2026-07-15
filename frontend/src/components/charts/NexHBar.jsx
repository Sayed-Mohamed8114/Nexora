import { useMemo } from "react";
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

export default function NexHBar({
  data,
  title,
  color = "#009EF7",
  suffix = "",
  colorMap,
}) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  );

  const chartHeight = Math.max(220, sorted.length * 38 + 40);

  return (
    <div className="p-5 h-auto bg-transparent">
      <h3 className="mb-4 text-sm font-semibold text-title">{title}</h3>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 10 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            type="category"
            dataKey="name"
            width={100}
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

          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
            {sorted.map((entry, i) => {
              const itemColor =
                (colorMap && colorMap[entry.name]) || color;

              const opacity = colorMap
                ? 1
                : 1 - i * 0.06 > 0.4
                ? 1 - i * 0.06
                : 0.4;

              return (
                <Cell
                  key={i}
                  fill={itemColor}
                  opacity={opacity}
                />
              );
            })}

            <LabelList
              dataKey="value"
              position="right"
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