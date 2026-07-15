import { useFilters } from "@/components/context/FilterContext";
import { filterStudents } from "@/components/data/useData";
import {
  computePlatformKPIs,
  computeAvgClicksByModule,
  computeAvgScoreByModule,
  computeModuleRanking,
  computeRateByModule,
} from "@/components/utils/KpiCalculators";
import { formatK, formatPct, formatScore } from "@/components/utils/formatters";
import KPICard from "@/components/cards/KPICard";
import NexVBar from "@/components/charts/NexVBar";
import NexHBar from "@/components/charts/NexHBar";
import {
  Users,
  Monitor,
  TrendingDown,
  Star,
  CheckCircle,
} from "lucide-react";

export default function ModulePerformance({ data }) {
  const { filters } = useFilters();

  const students = filterStudents(data.students, filters);
  const kpis = computePlatformKPIs(students);
  const avgClicksByModule = computeAvgClicksByModule(students);
  const avgScoreByModule = computeAvgScoreByModule(students);
  const moduleRanking = computeModuleRanking(students);
  const withdrawalByModule = computeRateByModule(
    students,
    "withdrawal"
  );

  // Sort withdrawal descending
  const withdrawalSorted = [...withdrawalByModule].sort(
    (a, b) => b.value - a.value
  );

  const totalStudents = students.length;

  const withdrawalRate =
    totalStudents > 0
      ? (students.filter((student) => student.res === "Withdrawn").length /
          totalStudents) *
        100
      : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Students"
          value={formatK(totalStudents)}
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
          title="Withdrawal Rate"
          value={formatPct(withdrawalRate)}
          icon={TrendingDown}
          iconBg="#F04438"
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
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <NexVBar
            title="AVG Clicks by Module"
            data={avgClicksByModule}
            color="#009EF7"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <NexHBar
            title="AVG Score by Module"
            data={avgScoreByModule}
            color="#009EF7"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <NexVBar
            title="Module Ranking"
            data={moduleRanking}
            color="#009EF7"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <NexHBar
            title="Withdrawal by Module"
            data={withdrawalSorted}
            color="#F04438"
          />
        </div>
      </div>
    </div>
  );
}