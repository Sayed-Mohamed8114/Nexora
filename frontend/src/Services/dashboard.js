import api from "../Api/axios";

export async function getStudentDashboard() {
  const res = await api.get("/api/Dashboard/student-dashboard");
  return res.data;
}

export async function getInstructorDashboard() {
  const res = await api.get("/api/Dashboard/tutor-dashboard");
  return res.data;
}

export async function getDashboardByRole(role) {
  return role === "Tutor" || role === "Instructor"
    ? getInstructorDashboard()
    : getStudentDashboard();
}

export const getDashboardStudent = getStudentDashboard;
export const getDashboardInstructor = getInstructorDashboard;

const unwrapDashboard = (response) => response?.data ?? response ?? null;

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export function normalizeDashboardResponse(response) {
  return unwrapDashboard(response);
}

export function getMainChartData(dashboard, role) {
  const data = unwrapDashboard(dashboard);
  if (!data) return [];

  if (role === "Tutor" || role === "Instructor") {
    return (data.courses ?? []).map((course) => ({
      name: course.codeModule || course.name || "Course",
      progress: toNumber(course.successPercentage),
      study: toNumber(course.enrolledCount),
    }));
  }

  return (data.monthlyAssessmentProgress ?? []).map((item) => ({
    name: `${item.month ?? ""}${item.year ? ` ${item.year}` : ""}`.trim(),
    progress: toNumber(item.averageScore),
    study: toNumber(item.submissionCount),
  }));
}

export function getSkillProgressData(dashboard, role) {
  const data = unwrapDashboard(dashboard);
  if (!data) return [];

  if (role === "Tutor" || role === "Instructor") {
    return (data.courses ?? []).map((course) => ({
      name: course.codeModule || course.name || "Course",
      progress: Math.round(toNumber(course.successPercentage)),
    }));
  }

  return (data.skills ?? []).map((skill) => ({
    name: skill.skillName || "Skill",
    progress: Math.round(toNumber(skill.averageScoreForSkill || skill.engagementProgress)),
  }));
}

export function getWaterfallChartData(dashboard, role) {
  const data = unwrapDashboard(dashboard);
  if (!data) return [];

  if (role === "Tutor" || role === "Instructor") {
    const enrolled = toNumber(data.totalEnrolledStudents);
    const unenrolled = -toNumber(data.totalUnenrolledStudents);
    return [
      { name: "Enrolled", value: enrolled },
      { name: "Unenrolled", value: unenrolled },
      { name: "Total", value: Math.max(0, enrolled + unenrolled), isTotal: true },
    ];
  }

  const completed = toNumber(data.completedCourses);
  const current = toNumber(data.currentCourses);
  const remaining = Math.max(0, toNumber(data.totalCourses) - completed - current);
  return [
    { name: "Completed", value: completed },
    { name: "Current", value: current },
    { name: "Remaining", value: remaining },
    { name: "Total", value: toNumber(data.totalCourses), isTotal: true },
  ];
}
