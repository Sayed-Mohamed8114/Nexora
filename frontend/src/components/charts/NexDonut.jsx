import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RADIAN = Math.PI / 180;

function renderLabel({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  value,
}) {
  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#475569"
      fontSize={11}
      fontWeight={500}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {name} ({value})
    </text>
  );
}

export default function NexDonut({ data, title, total }) {
  const grandTotal = data.reduce((sum, item) => sum + item.value, 0) || 0;

  return (
    <div className="bg-transparent p-5  h-auto rounded-2xl">
      <h3 className="mb-4 text-sm font-semibold text-title">{title}</h3>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            strokeWidth={0}
            label={(props) =>
              renderLabel({
                ...props,
                total: grandTotal || 1,
              })
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>

          {/* Center label */}
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-title text-2xl font-bold"
          >
            {(total !== undefined ? total : grandTotal).toLocaleString()}
          </text>

          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-body text-label"
          >
            Total
          </text>

          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              fontSize: 12,
            }}
            formatter={(value) => [
              `${value} (${((value / grandTotal) * 100).toFixed(1)}%)`,
              "",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-1.5 text-xs text-body"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.name}{" "}
            <span className="font-medium text-title">
              {((item.value / grandTotal) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}