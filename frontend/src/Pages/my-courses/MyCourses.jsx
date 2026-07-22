import CourseCard from "@/Components/layout/CourseCard";
import DashboardLayout from "@/mainLayout/DashboardLayout";
import Loader from "@/Components/Loader/Loader";
import { enrolled, unEnroll } from "@/Services/courses";
import { useEffect, useState } from "react";

const MyCourses = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const loadMyCourses = async () => {
    try {
      const data = await enrolled();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnEnroll = async (codeModule, codePresentation) => {
    try {
      await unEnroll(codeModule, codePresentation);
      await loadMyCourses();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMyCourses();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      {courses.length === 0 ? (
        <div className="mt-10 text-center text-slate-500">
          You haven't enrolled in any courses yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={`${course.codeModule}-${course.codePresentation}`}
              course={course}
              enrolledCourses={courses}
              onUnEnroll={handleUnEnroll}
              showUnEnroll
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyCourses;
