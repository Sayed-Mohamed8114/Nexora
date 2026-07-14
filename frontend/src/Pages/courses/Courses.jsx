import CourseCard from "@/Components/layout/CourseCard";
import Loader from "@/Components/Loader/Loader";
import DashboardLayout from "@/mainLayout/DashboardLayout";
import { getCourses, enroll } from "@/Services/courses";
import { AnimatePresence, motion } from "framer-motion";
import { getCurrentUser } from "@/Services/user";
import { useState, useEffect } from "react";
import AddCourseForm from "@/Components/layout/AddCourseForm";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCourses();
      console.log(data);
      setCourses(data);
    } catch (error) {
      console.error(error);
      setError("failed to load courses");
    } finally {
      setLoading(false);
    }
  };
  const handleEnroll = async (codeModule, codePresentation) => {
    try {
      await enroll(codeModule, codePresentation);
      alert("successfully enrolled !");
      await loadCourses();
    } catch (err) {
      console.log(err);
      alert("failed to enroll");
    }
  };

  // get the current user role
  useEffect(() => {
    loadCourses();
    getCurrentUser().then((res) => {
      if (res.success) {
        setUser(res.data);
      }
    });
  }, []);

  // use it when you open the page
  useEffect(() => {
    loadCourses();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-start mt-3 justify-between gap-4 sm:flex-row sm:items-center">
        {user?.role === "Tutor" && (
          <>
            <motion.button
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onClick={() => setOpen((prev) => !prev)}
              className="fixed bottom-6 right-6 z-999 cursor-pointer rounded-full bg-sky-900 px-5 py-3 text-white shadow-lg transition-transform duration-300 hover:scale-110"
            >
              {open ? "Cancel" : "Add Course"}
            </motion.button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 25,
                  }}
                  className="fixed top-30 right-0 z-998  w-1/2  shadow-2xl full"
                >
                  <AddCourseForm />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full sm:w-75 rounded-md border border-slate-light px-4 py-2 text-body text-slate-medium outline-none focus:border-primary"
        />

        {/* Filter */}
        <select
          className="w-full sm:w-62.5 rounded-md border border-slate-light px-4 py-2 text-body text-slate-medium outline-none focus:border-primary"
          defaultValue=""
        >
          <option value="" disabled>
            Filter by Module
          </option>

          {[...new Set(courses.map((course) => course.codeModule))].map(
            (module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ),
          )}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Empty */}
      {!error && courses.length === 0 && (
        <div className="mt-12 text-center text-slate-500">
          No courses available.
        </div>
      )}

      {/* Courses */}
      {courses.length > 0 && (
        <section className="mt-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={`${course.codeModule}-${course.codePresentation}`}
                course={course}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        </section>
      )}
    </DashboardLayout>
  );
};

export default Courses;
