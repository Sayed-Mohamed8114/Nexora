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

const scoreResult = (score) => {
  if (score >= 85) return "Distinction";
  if (score >= 50) return "Pass";
  if (score > 0) return "Fail";
  return "Withdrawn";
};

const makeRows = (count, factory) =>
  Array.from({ length: Math.max(0, Math.round(toNumber(count))) }, (_, index) => factory(index));

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

export function buildAnalyticsData(dashboard, role) {
  const data = unwrapDashboard(dashboard);
  if (!data) return { students: [], courses: [], assessmentTypes: [] };

  if (role === "Tutor" || role === "Instructor") {
    const courses = data.courses ?? [];
    const students = courses.flatMap((course, courseIndex) => {
      const moduleName = course.codeModule || course.name || `Course ${courseIndex + 1}`;
      const base = {
        mod: moduleName,
        pres: course.codePresentation || "Current",
        reg: "All",
        edu: "Tutor Course",
        cred: toNumber(course.hours),
        nass: toNumber(course.assessmentCount),
        prev: 0,
      };

      return [
        ...makeRows(course.enrolledCount, (index) => ({
          ...base,
          id: `${moduleName}-enrolled-${index}`,
          res: toNumber(course.successPercentage) >= 85 ? "Distinction" : "Pass",
          score: toNumber(course.successPercentage),
          clicks: toNumber(course.hours),
        })),
        ...makeRows(course.unenrolledCount, (index) => ({
          ...base,
          id: `${moduleName}-unenrolled-${index}`,
          res: "Withdrawn",
          score: 0,
          clicks: 0,
        })),
      ];
    });

    return {
      students,
      courses,
      assessmentTypes: [
        { type: "Assessments", count: toNumber(data.totalAssessments) },
        { type: "Courses", count: toNumber(data.totalCourses) },
      ],
    };
  }

  const skills = data.skills ?? [];
  const students = skills.map((skill, index) => {
    const score = toNumber(skill.averageScoreForSkill || skill.engagementProgress);
    return {
      id: skill.id ?? index,
      mod: skill.skillName || `Skill ${index + 1}`,
      pres: skill.targetLevel || "Current",
      reg: "All",
      edu: skill.targetLevel || "Learning Path",
      res: scoreResult(score),
      score,
      clicks: toNumber(skill.engagementProgress),
      prev: 0,
      cred: 60,
      nass: (skill.recommendedCourses ?? []).length || toNumber(data.totalAssessmentsSubmitted),
    };
  });

  const courses = Array.from({ length: toNumber(data.totalCourses) }, (_, index) => ({
    id: index + 1,
    name: `Course ${index + 1}`,
  }));

  return {
    students,
    courses,
    assessmentTypes: [
      { type: "Submitted", count: toNumber(data.totalAssessmentsSubmitted) },
      { type: "Current", count: toNumber(data.currentCourses) },
      { type: "Completed", count: toNumber(data.completedCourses) },
    ],
  };
}
