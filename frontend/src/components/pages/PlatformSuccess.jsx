import { useFilters } from "@/components/context/FilterContext";
import { filterStudents } from "@/components/data/useData";
import {
  computePlatformKPIs,
  computeClicksByModule,
  computeClicksByResult,
  computeActivityTypeUsage,
} from "@/components/utils/KpiCalculators";
import { formatK, formatPct, formatScore } from "@/components/utils/formatters";
import KPICard from "@/components/cards/KPICard";
import NexScatter from "@/components/charts/NexScatter";
import NexHBar from "@/components/charts/NexHBar";
import NexVBar from "@/components/charts/NexVBar";
import NexPie from "@/components/charts/NexPie";
import {
  Users,
  Monitor,
  MousePointerClick,
  Star,
  CheckCircle,
} from "lucide-react";

const RESULT_COLORS = {
  Pass: "#16C47F",
  Fail: "#F04438",
  Withdrawn: "#F59E0B",
  Distinction: "#7C3AED",
};

export default function PlatformSuccess({ data }) {
  const { filters } = useFilters();

  const students = filterStudents(data.students, filters);
  const kpis = computePlatformKPIs(students);
  const clicksByModule = computeClicksByModule(students);
  const clicksByResult = computeClicksByResult(students);
  const activityUsage = computeActivityTypeUsage(data.assessmentTypes);

  // Scatter data: one point per final_result group with avg clicks & avg score
  const resultGroups = ["Pass", "Fail", "Withdrawn", "Distinction"];

  const scatterData = resultGroups
    .map((result) => {
      const group = students.filter((student) => student.res === result);

      if (group.length === 0) return null;

      const avgClicks =
        group.reduce((sum, student) => sum + student.clicks, 0) /
        group.length;

      const avgScore =
        group.reduce((sum, student) => sum + student.score, 0) /
        group.length;

      return {
        name: result,
        x: Math.round(avgClicks),
        y: Math.round(avgScore * 10) / 10,
        color: RESULT_COLORS[result],
      };
    })
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Engagements"
          value={formatK(kpis.totalEngaged)}
          icon={Users}
          iconBg="#009EF7"
        />

        <KPICard
          title="Active Students %"
          value={formatPct(kpis.activePct)}
          icon={Monitor}
          iconBg="#17C9D3"
        />

        <KPICard
          title="Total Clicks"
          value={formatK(kpis.totalClicks)}
          icon={MousePointerClick}
          iconBg="#7C3AED"
        />

        <KPICard
          title="Avg Score"
          value={formatScore(kpis.avgScore)}
          icon={Star}
          iconBg="#F59E0B"
          highlight
        />

        <KPICard
          title="Pass Rate"
          value={formatPct(kpis.passRate)}
          icon={CheckCircle}
          iconBg="#16C47F"
        />
      </div>

      {/* Charts 2x2 Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="bg-white/90 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur rounded-md items-center justify-center">
          <NexScatter
            title="Clicks vs Score"
            data={scatterData}
            xLabel="Avg Clicks"
            yLabel="Avg Score"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <NexHBar
            title="Clicks by Module"
            data={clicksByModule}
            color="#009EF7"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <NexVBar
            title="Clicks by Final Result"
            data={clicksByResult}
            colorMap={RESULT_COLORS}
          />
        </div>

        <div className="bg-white/25 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur rounded-xl items-center justify-center">
          <NexPie
            title="Activity Type Usage"
            data={activityUsage}
          />
        </div>
      </div>
    </div>
  );
}