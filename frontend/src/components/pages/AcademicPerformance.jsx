import { useFilters } from "@/components/context/FilterContext";
import { filterStudents } from "@/components/data/useData";
import {
  computeAcademicKPIs,
  computeAvgScoreByResult,
  computeAvgScoreByModule,
} from "@/components/utils/KpiCalculators";
import { formatPct, formatScore } from "@/components/utils/formatters";
import KPICard from "@/components/cards/KPICard";
import NexVBar from "@/components/charts/NexVBar";
import NexHBar from "@/components/charts/NexHBar";
import {
  Star,
  Trophy,
  BookOpen,
  BarChart3,
  XCircle,
} from "lucide-react";

const RESULT_COLORS = {
  Pass: "#16C47F",
  Fail: "#F04438",
  Withdrawn: "#F59E0B",
  Distinction: "#7C3AED",
};

export default function AcademicPerformance({ data }) {
  const { filters } = useFilters();

  console.log(data)
  const students = filterStudents(data.students, filters);
  const kpis = computeAcademicKPIs(students);
  const avgScoreByResult = computeAvgScoreByResult(students);
  const avgScoreByModule = computeAvgScoreByModule(students);

  const totalWithScores = students.filter((student) => student.score > 0).length;

  const failRate =
    students.length > 0
      ? (students.filter((student) => student.res === "Fail").length /
          students.length) *
        100
      : 0;

  return (
    <div className="space-y-6 ">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Avg Score"
          value={formatScore(kpis.avgScore)}
          icon={Star}
          iconBg="#F59E0B"
          highlight
          
        />

        <KPICard
          title="Distinction Rate"
          value={formatPct(kpis.distinctionRate)}
          icon={Trophy}
          iconBg="#7C3AED"
        />

        <KPICard
          title="Avg Assessments/Student"
          value={kpis.avgAssessments}
          icon={BookOpen}
          iconBg="#17C9D3"
        />

        <KPICard
          title="Total with Scores"
          value={totalWithScores}
          icon={BarChart3}
          iconBg="#009EF7"
        />

        <KPICard
          title="Fail Rate"
          value={formatPct(failRate)}
          icon={XCircle}
          iconBg="#F04438"
        />
      </div>

      {/* Charts 2x2 Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="bg-white/85 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur rounded-md items-center justify-center">
          <NexVBar
            title="Score Distribution"
            data={kpis.scoreDistribution}
            color="#009EF7"
          />
        </div>

        <div className="bg-white/75 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur rounded-md items-center justify-center">
          <NexHBar
            title="Average Score by Final Result"
            data={avgScoreByResult}
            colorMap={RESULT_COLORS}
          />
        </div>

        <div className="bg-white/75 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur rounded-md items-center justify-center">
          <NexHBar
            title="Score by Education Level"
            data={kpis.scoreByEdu}
            color="#7C3AED"
          />
        </div>

        <div className="bg-white/75 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur rounded-md items-center justify-center">
          <NexHBar
            title="Average Score by Module"
            data={avgScoreByModule}
            color="#009EF7"
          />
        </div>
      </div>
    </div>
  );
}