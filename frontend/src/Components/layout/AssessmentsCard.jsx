import { Link } from "react-router-dom";
import { CalendarDays, BookOpen, Users } from "lucide-react";

const AssessmentCard = ({
  assessment,
  isTutor = false,
  onAddQuestions,
  studentResult,
}) => {
  return (
    <div className="w-[95%] rounded-2xl border border-slate-200 bg-sky-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-sky-900">
            {assessment.assessmentType}
          </h2>

          <p className="mt-2 flex items-center gap-2 text-slate-500">
            <CalendarDays size={18} />
            {assessment.date}
          </p>
        </div>

        <div className="rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-900">
          Assessment #{assessment.idAssessment}
        </div>
      </div>

      {/* Information */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm text-slate-500">Module</p>
          <p className="mt-1 font-semibold">{assessment.codeModule}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Presentation</p>
          <p className="mt-1 font-semibold">
            {assessment.codePresentation}
          </p>
        </div>

        <div>
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <BookOpen size={16} />
            Questions
          </p>

          <p className="mt-1 text-lg font-bold">
            {assessment.questionCount}
          </p>
        </div>

        <div>
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Users size={16} />
            Completed
          </p>

          <p className="mt-1 text-lg font-bold">
            {assessment.completedByStudents}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap justify-end  gap-6">
        {isTutor ? (
          <>
            <Link
              to={`/assessments/${assessment.idAssessment}`}
              className="rounded-lg bg-sky-700 px-5 py-2 font-semibold text-white transition hover:bg-sky-800"
            >
              View Questions
            </Link>

            <button
              onClick={() => onAddQuestions(assessment)}
              className="rounded-lg bg-green-700 px-5 py-2 font-semibold text-white transition hover:bg-green-600"
            >
              Add Questions
            </button>
          </>
        ) : studentResult ? (
          <>
            <div className="rounded-lg items-center bg-green-100 px-5 py-2 flex gap-3 text-center">
              <p className="text-sm font-medium text-green-700">
                You got
              </p>

              <p className="mt-1 text-lg font-bold text-green-800">
                {studentResult.score}%
              </p>

              <p className="mt-2 text-xs text-green-700">
                Submitted on: {studentResult.dateSubmitted}
              </p>
            </div>

            <button
              disabled
              className="cursor-not-allowed rounded-lg bg-slate-400 px-5 py-2 font-semibold text-white"
            >
              Already Completed
            </button>
          </>
        ) : (
          <Link
            to={`/assessments/${assessment.idAssessment}/take`}
            className="rounded-lg bg-sky-700 px-5 py-2 font-semibold text-white transition hover:bg-sky-600"
          >
            Start Assessment
          </Link>
        )}
      </div>
    </div>
  );
};

export default AssessmentCard;