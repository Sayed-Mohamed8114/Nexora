import { Link } from "react-router-dom";
import DropdownMenuComponent from "./DropDownMenuComponent";

const CourseCard = ({ course, onEnroll }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="flex justify-between items-start p-5">
        <div>
          <h2 className="text-xl justify-between items-start p-5">
            {course.codeModule}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Presentation: {course.codePresentation}
          </p>
        </div>
        <DropdownMenuComponent />
      </div>
      <div className="px-5 space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-700">Tutor</span>
          <span className="font-medium">
            {course.tutor
              ? `${course.tutor.firstName} ${course.tutor.lastName}`
              : "unknown"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Students</span>

          <span className="font-medium">
            {course.studentInfos?.length ?? 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Assessments</span>

          <span className="font-medium">{course.assessments?.length ?? 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Activities</span>

          <span className="font-medium">{course.vles?.length ?? 0}</span>
        </div>
      </div>
      <div className="flex gap-3 p-5">
        <Link
          to={`/api/courses/${course.codeModule}/${course.codePresentation}`}
          className="flex-1 border border-slate-300 rounded-lg py-2 text-center hover:slate-100 transition"
        >
          Details
        </Link>
        <button
          onClick={() => onEnroll(course.codeModule, course.codePresentation)}
          className="flex-1 bg-primary text-white roudend-lg py-2 hover:opacity-90 transition"
        >
          Enroll
        </button>
      </div>
    </div>
  );
};
export default CourseCard;
