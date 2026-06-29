import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";

const weeklyData = [
  { week: "Wk 1", withApp: 52, withoutApp: 50 },
  { week: "Wk 2", withApp: 57, withoutApp: 51 },
  { week: "Wk 3", withApp: 63, withoutApp: 52 },
  { week: "Wk 4", withApp: 70, withoutApp: 52 },
  { week: "Wk 6", withApp: 76, withoutApp: 53 },
  { week: "Wk 8", withApp: 83, withoutApp: 54 },
  { week: "Wk 10", withApp: 88, withoutApp: 55 },
  { week: "Wk 12", withApp: 93, withoutApp: 56 },
];

const outcomeData = [
  { metric: "Avg Score", tracked: 88, untracked: 63 },
  { metric: "Task Rate", tracked: 91, untracked: 58 },
  { metric: "Goal Hit", tracked: 84, untracked: 47 },
  { metric: "Retention", tracked: 79, untracked: 52 },
  { metric: "Self-Efficacy", tracked: 87, untracked: 55 },
];

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const withApp = payload.find((p) => p.dataKey === "withApp");
  const withoutApp = payload.find((p) => p.dataKey === "withoutApp");
  const gap = withApp && withoutApp ? withApp.value - withoutApp.value : 0;

  return (
    <div className="bg-sky-950 border border-sky-700 rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="text-sky-300 font-semibold mb-2 tracking-wide">{label}</p>
      {withApp && (
        <p className="text-sky-100">
          <span className="inline-block w-2 h-2 rounded-full bg-sky-400 mr-2" />
          App users:{" "}
          <span className="font-bold text-sky-300">{withApp.value}%</span>
        </p>
      )}
      {withoutApp && (
        <p className="text-sky-500 mt-1">
          <span className="inline-block w-2 h-2 rounded-full bg-sky-700 mr-2" />
          No app: <span className="font-bold">{withoutApp.value}%</span>
        </p>
      )}
      {gap > 0 && (
        <p className="mt-2 pt-2 border-t border-sky-800 text-sky-400 font-semibold">
          +{gap}pt gap
        </p>
      )}
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const tracked = payload.find((p) => p.dataKey === "tracked");
  const untracked = payload.find((p) => p.dataKey === "untracked");

  return (
    <div className="bg-sky-950 border border-sky-700 rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="text-sky-300 font-semibold mb-2">{label}</p>
      {tracked && (
        <p className="text-sky-100">
          <span className="inline-block w-2 h-2 rounded-full bg-sky-400 mr-2" />
          Tracked:{" "}
          <span className="font-bold text-sky-300">{tracked.value}%</span>
        </p>
      )}
      {untracked && (
        <p className="text-sky-500 mt-1">
          <span className="inline-block w-2 h-2 rounded-full bg-sky-800 mr-2" />
          Untracked: <span className="font-bold">{untracked.value}%</span>
        </p>
      )}
    </div>
  );
};

const StatPill = ({ value, label }) => (
  <div className="flex flex-col items-center px-5 py-3 rounded-2xl bg-sky-900/40 border border-sky-800/60">
    <span className="text-2xl font-bold text-sky-300 tabular-nums">
      {value}
    </span>
    <span className="text-xs text-sky-500 mt-0.5 text-center leading-tight">
      {label}
    </span>
  </div>
);

export default function WhyCreated() {
  const [hoveredWeek, setHoveredWeek] = useState(null);

  return (
    <section className="relative w-[95%] rounded-2xl bg-white/10 px-5 text-black text-center backdrop-blur-xl mt-50 p-4 overflow-hidden items-start">
      {/* subtle ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-150 h-150 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 w-125 h-125 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)",
        }}
      />

      <div className="relative p-5 mx-auto ">
        {/* — section header — */}
        <div className="mb-14 flex flex-col gap-3 justify-center items-center">
          <h2 className="text-5xl font-bold bg-linear-to-b from-sky-800 to-sky-950 font-sans bg-clip-text text-transparent  leading-tight">
            Why we created Nexora ?
          </h2>
          <p className="font-semibold tracking-wider text-lg mt-3">
            Nexora was created to bridge that gap. By combining learning tools
            with intelligent analytics and real-time performance tracking, our
            platform helps students monitor their progress, recognize their
            strengths and weaknesses, and receive data-driven recommendations.
            We believe that when learners understand their journey, they can
            make smarter decisions, stay motivated, and achieve greater academic
            success.{" "}
          </p>
          <p className="font-bold tracking-wider text-2xl mt-3 text-start">
            We also created a Visual representation of what we mean to make every thing clear to you.{" "}
          </p>
        </div>

        {/* — top stat pills — */}


        {/* — charts grid — */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Area chart – 3 cols */}
          <div className="lg:col-span-3 bg-sky-950 border border-sky-800/50 rounded-3xl p-6">
            <div className="mb-6">
              <h3 className="text-sky-100 font-semibold text-lg">
                Performance trajectory over 12 weeks
              </h3>
              <p className="text-sky-500 text-sm mt-1">
                Composite score (%) · weekly average across cohort
              </p>
            </div>

            {/* legend */}
            <div className="flex gap-5 mb-6">
              <span className="flex items-center gap-2 text-sm text-sky-200">
                <span className="w-5 h-0.5 bg-sky-400 rounded-full inline-block" />
                With app
              </span>
              <span className="flex items-center gap-2 text-sm text-white">
                <span className="w-5 h-0.5 text-white rounded-full inline-block" />
                Without app
              </span>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={weeklyData}
                margin={{ top: 4, right: 8, left: -12, bottom: 0 }}
                onMouseMove={(s) =>
                  s.activeLabel && setHoveredWeek(s.activeLabel)
                }
                onMouseLeave={() => setHoveredWeek(null)}
              >
                <defs>
                  <linearGradient id="fillWith" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="white" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="fillWithout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c4a6e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="white" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#0c4a6e"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#7dd3fc", fontSize: 12 }}
                  axisLine={{ stroke: "#0c4a6e" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[45, 100]}
                  tick={{ fill: "#38bdf8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  content={<CustomAreaTooltip />}
                  cursor={{
                    stroke: "#38bdf8",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="withoutApp"
                  stroke="#164e63"
                  strokeWidth={2}
                  fill="url(#fillWithout)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#0284c7",
                    stroke: "#0c4a6e",
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="withApp"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  fill="url(#fillWith)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#38bdf8",
                    stroke: "#0ea5e9",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>

            <p className="mt-4 text-sky-600 text-xs text-right">
              Baseline equalised at week 1 · composite of quiz, assignment &
              participation scores
            </p>
          </div>

          {/* Bar chart – 2 cols */}
          <div className="lg:col-span-2 bg-sky-900 border border-sky-800/50 rounded-3xl p-6">
            <div className="mb-6">
              <h3 className="text-sky-100 font-semibold text-lg">
                End-of-term outcomes
              </h3>
              <p className="text-sky-500 text-sm mt-1">
                Tracked vs untracked · 5 key metrics (%)
              </p>
            </div>

            {/* legend */}
            <div className="flex gap-5 mb-6">
              <span className="flex items-center gap-2 text-sm text-sky-200">
                <span className="w-3 h-3 rounded-sm bg-sky-400 inline-block" />
                Tracked
              </span>
              <span className="flex items-center gap-2 text-sm text-white">
                <span className="w-3 h-3 rounded-sm bg-white inline-block" />
                Untracked
              </span>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={outcomeData}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                barCategoryGap="28%"
                barGap={3}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#0c4a6e"
                  strokeOpacity={0.5}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "#38bdf8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="metric"
                  tick={{ fill: "#7dd3fc", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "rgba(56,189,248,0.05)" }}
                />
                <ReferenceLine
                  x={70}
                  stroke="#0ea5e9"
                  strokeDasharray="3 3"
                  strokeOpacity={0.4}
                />
                <Bar dataKey="untracked" fill="white" radius={[0, 4, 4, 0]} />
                <Bar dataKey="tracked" fill="#38bdf8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <p className="mt-4 text-sky-600 text-xs">
              Dashed line marks 70% benchmark · all differences p &lt; 0.01
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
