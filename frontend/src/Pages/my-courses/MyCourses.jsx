import CourseCard from "@/Components/layout/CourseCard";
import DashboardLayout from "@/mainLayout/DashboardLayout";
import { enrolled } from "@/Services/courses";
import { useEffect, useState } from "react";

const MyCourses = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const loadMyCourses = async () => {
    try {
      const data = await enrolled();
      setCourses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyCourses();
  }, []);
  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-10">
        {courses.map((course) => (
          <CourseCard
            key={`${course.codeModule}-${course.codePresentation}`}
            course={course}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default MyCourses;
