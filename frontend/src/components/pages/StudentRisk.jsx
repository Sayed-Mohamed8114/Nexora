import { useFilters } from "@/components/context/FilterContext";
import { filterStudents } from "@/components/data/useData";
import {
  computeStudentRiskKPIs,
  computePrevAttemptsByResult,
  computeAvgScoreByResult,
  computeClicksByResult,
  computeWithdrawalByCredits,
} from "@/components/utils/KpiCalculators";
import { formatK } from "@/components/utils/formatters";
import KPICard from "@/components/cards/KPICard";
import NexVBar from "@/components/charts/NexVBar";
import NexHBar from "@/components/charts/NexHBar";
import {
  Users,
  AlertTriangle,
  Activity,
  CheckCircle,
  MousePointerClick,
} from "lucide-react";

const RESULT_COLORS = {
  Pass: "#16C47F",
  Fail: "#F04438",
  Withdrawn: "#F59E0B",
  Distinction: "#7C3AED",
};

export default function StudentRisk({ data }) {
  const { filters } = useFilters();

  const students = filterStudents(data.students, filters);
  const kpis = computeStudentRiskKPIs(students);
  const prevAttempts = computePrevAttemptsByResult(students);
  const avgScoreByResult = computeAvgScoreByResult(students);
  const clicksByResult = computeClicksByResult(students);
  const withdrawalByCredits = computeWithdrawalByCredits(students);

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
          title="High Risk Students"
          value={formatK(kpis.highRisk)}
          icon={AlertTriangle}
          iconBg="#F04438"
        />

        <KPICard
          title="Medium Risk"
          value={formatK(kpis.mediumRisk)}
          icon={Activity}
          iconBg="#F59E0B"
        />

        <KPICard
          title="Low Risk Students"
          value={formatK(kpis.lowRisk)}
          icon={CheckCircle}
          iconBg="#16C47F"
        />

        <KPICard
          title="Avg Engagement"
          value={formatK(kpis.avgEngagement)}
          icon={MousePointerClick}
          iconBg="#009EF7"
        />
      </div>

      {/* Charts 2x2 Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="bg-white/30 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur rounded-md items-center justify-center">
          <NexVBar
            title="Previous Attempts vs Final Result"
            data={prevAttempts}
            colorMap={RESULT_COLORS}
          />
        </div>

        <div className="bg-white/30 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur rounded-md items-center justify-center">
          <NexHBar
            title="Average Score by Final Result"
            data={avgScoreByResult}
            colorMap={RESULT_COLORS}
          />
        </div>

        <div className="bg-white/30 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur rounded-md items-center justify-center">
          <NexVBar
            title="Clicks by Final Result"
            data={clicksByResult}
            colorMap={RESULT_COLORS}
          />
        </div>

        <div className="bg-white/30 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur rounded-md items-center justify-center">
          <NexVBar
            title="Withdrawal by Studied Credits"
            data={withdrawalByCredits}
            color="#009EF7"
          />
        </div>
      </div>
    </div>
  );
}
