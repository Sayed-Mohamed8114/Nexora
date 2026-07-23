import { useEffect, useState } from "react";
import DashboardLayout from "@/mainLayout/DashboardLayout";
import ProgressCard from "@/Components/layout/ProgressCard";
import PomodoroClock from "@/Components/layout/PomodoroClock";
import TodoList from "@/Components/layout/ToDoList";
import MainChart from "@/Components/layout/MainChart";
import ProgressBar from "@/Components/layout/ProgressBar";
import { getCurrentUser } from "@/Services/user";
import {
  getDashboardByRole,
  getMainChartData,
  getSkillProgressData,
  getWaterfallChartData,
  normalizeDashboardResponse,
} from "@/Services/dashboard";

const tutorRoles = ["Tutor", "Instructor"];

const MyDashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [skillsProgress, setSkillsProgress] = useState([]);
  const [waterfallData, setWaterfallData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userRes = await getCurrentUser();
        if (!userRes?.success) return;

        const role = userRes.data?.role;
        const dashboardRes = await getDashboardByRole(role);
        const dashboard = normalizeDashboardResponse(dashboardRes);

        setUserRole(role);
        setDashboardData(dashboard);
        setChartData(getMainChartData(dashboard, role));
        setSkillsProgress(getSkillProgressData(dashboard, role));
        setWaterfallData(getWaterfallChartData(dashboard, role));
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const isTutor = tutorRoles.includes(userRole);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[55vh] w-full items-center justify-center rounded-md bg-white/80 p-6 text-center shadow-sm">
          <p className="text-base font-semibold text-sky-950">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (isTutor) {
    return <TutorDashboard dashboardData={dashboardData} />;
  }

  return (
    <DashboardLayout>
      <div className="grid h-auto w-full grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="col-span-1 rounded-md border-white/70 py-5 text-sky-950 shadow-xl shadow-sky-900/10 backdrop-blur xl:col-span-9">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full flex-1">
              <MainChart data={chartData} />
            </div>
            <ProgressCard data={waterfallData} />
          </div>
          <div className="mt-5 flex w-full flex-col items-start justify-center px-2 py-1.5">
            <h2 className="mb-2 bg-linear-to-r from-sky-700 to-sky-950 bg-clip-text font-serif text-2xl font-extrabold text-transparent shadow-2xl shadow-white sm:text-3xl">
              Skills Progress
            </h2>
            <div className="no-scrollbar max-h-[35vh] w-full flex-1 cursor-grab space-y-3 overflow-y-auto pr-3 lg:w-1/2 xl:w-1/2">
              {skillsProgress.map((skill) => (
                <ProgressBar
                  key={skill.name}
                  name={skill.name}
                  progress={skill.progress}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-6 rounded-md p-2 md:flex-row xl:col-span-3 xl:flex-col">
          <div className="w-full flex-1">
            <TodoList />
          </div>
          <div className="w-full max-w-md flex-1 xl:max-w-none">
            <PomodoroClock />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const TutorDashboard = ({ dashboardData }) => {
  const courses = dashboardData?.courses ?? [];
  const summaryCards = [
    { label: "Courses", value: formatNumber(dashboardData?.totalCourses) },
    {
      label: "Enrolled Students",
      value: formatNumber(dashboardData?.totalEnrolledStudents),
    },
    {
      label: "Unenrolled Students",
      value: formatNumber(dashboardData?.totalUnenrolledStudents),
    },
    {
      label: "Total Students",
      value: formatNumber(dashboardData?.totalStudents),
    },
    {
      label: "Success Rate",
      value: formatPercent(dashboardData?.overallSuccessPercentage),
    },
    {
      label: "Assessments",
      value: formatNumber(dashboardData?.totalAssessments),
    },
  ];

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-3 rounded-md border border-white/80 bg-white/80 p-4 shadow-sm sm:p-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase text-sky-700">
              Tutor Dashboard
            </p>
            <h1 className="mt-1 break-words text-2xl font-extrabold text-sky-950 sm:text-3xl">
              {dashboardData?.tutorName || "Your courses"}
            </h1>
            <p className="mt-1 break-words text-sm text-slate-600">
              {dashboardData?.tutorEmail || "Course performance overview"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {summaryCards.map((item) => (
            <div
              key={item.label}
              className="rounded-md border border-sky-100 bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 break-words text-2xl font-extrabold text-sky-950">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
            {courses.map((course) => (
              <TutorCourseCard
                key={`${course.codeModule}-${course.codePresentation}`}
                course={course}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-sky-200 bg-white/80 p-8 text-center shadow-sm">
            <h2 className="text-xl font-extrabold text-sky-950">
              No courses yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Courses assigned to this tutor will appear here.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const TutorCourseCard = ({ course }) => (
  <article className="flex min-h-full flex-col rounded-md border border-sky-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-bold uppercase text-sky-700">
          {course.codeModule} / {course.codePresentation}
        </p>
        <h2 className="mt-1 break-words text-xl font-extrabold text-sky-950">
          {course.name || "Untitled course"}
        </h2>
      </div>
      <span className="w-fit rounded-md bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
        {formatPercent(course.successPercentage)}
      </span>
    </div>

    <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">
      {course.description || "No description available."}
    </p>

    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
      <CourseStat label="Hours" value={formatNumber(course.hours)} />
      <CourseStat label="Enrolled" value={formatNumber(course.enrolledCount)} />
      <CourseStat label="Unenrolled" value={formatNumber(course.unenrolledCount)} />
      <CourseStat label="Students" value={formatNumber(course.totalStudentsCount)} />
      <CourseStat label="Assessments" value={formatNumber(course.assessmentCount)} />
      <CourseStat label="Success" value={formatPercent(course.successPercentage)} />
    </div>

    <div className="mt-5 flex flex-wrap gap-2">
      {(course.skills?.length ? course.skills : ["No skills"]).map((skill) => (
        <span
          key={skill}
          className="rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800"
        >
          {skill}
        </span>
      ))}
    </div>
  </article>
);

const CourseStat = ({ label, value }) => (
  <div className="rounded-md bg-slate-50 p-3">
    <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
    <p className="mt-1 break-words text-lg font-extrabold text-sky-950">
      {value}
    </p>
  </div>
);

const formatNumber = (value) => Number(value ?? 0).toLocaleString();
const formatPercent = (value) => `${Number(value ?? 0).toFixed(1)}%`;

export default MyDashboard;
