import { useFilters } from "@/Components/context/FilterContext";
import { filterStudents } from "@/Components/data/useData";
import {
  computeExecutiveKPIs,
  computeOutcomeDistribution,
  computeRateByModule,
} from "@/Components/utils/KpiCalculators";
import { formatK, formatPct, formatScore } from "@/Components/utils/formatters";
import KPICard from "@/Components/cards/KPICard";
import NexDonut from "@/Components/charts/NexDonut";
import NexVBar from "@/Components/charts/NexVBar";
import {
  Users,
  GraduationCap,
  CheckCircle,
  TrendingDown,
  Star,
} from "lucide-react";

export default function ExecutiveOverview({ data }) {
  const { filters } = useFilters();

  const students = filterStudents(data.students, filters);
  const kpis = computeExecutiveKPIs(students, data.courses);
  const outcomeData = computeOutcomeDistribution(students);
  const failByModule = computeRateByModule(students, "fail");
  const passByModule = computeRateByModule(students, "pass");
  const withdrawalByModule = computeRateByModule(students, "withdrawal");

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Students"
          value={formatK(kpis.total)}
          icon={Users}
          iconBg="#009EF7"
        />

        <KPICard
          title="Total Courses"
          value={kpis.totalCourses}
          icon={GraduationCap}
          iconBg="#17C9D3"
        />

        <KPICard
          title="Pass Rate"
          value={formatPct(kpis.passRate)}
          icon={CheckCircle}
          iconBg="#16C47F"
        />

        <KPICard
          title="Withdrawal Rate"
          value={formatPct(kpis.withdrawalRate)}
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
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="bg-white/50 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur rounded-lg items-center justify-center">
          <NexDonut
            title="Students Final Result Distribution"
            data={outcomeData}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <NexVBar
            title="Fail Rate by Code Module"
            data={failByModule}
            color="#F04438"
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <NexVBar
            title="Pass Rate by Code Module"
            data={passByModule}
            color="#16C47F"
            sortDesc
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <NexVBar
            title="Withdrawal Rate by Code Module"
            data={withdrawalByModule}
            color="#F04438"
            sortDesc
          />
        </div>
      </div>

      {/* Insights */}
    </div>
  );
}
