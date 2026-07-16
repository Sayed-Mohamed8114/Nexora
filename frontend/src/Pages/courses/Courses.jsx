import CourseCard from "@/Components/layout/CourseCard";
import Loader from "@/Components/Loader/Loader";
import DashboardLayout from "@/mainLayout/DashboardLayout";
import { getCourses, enroll, enrolled } from "@/Services/courses";
import { AnimatePresence, motion } from "framer-motion";
import { getCurrentUser } from "@/Services/user";
import { useState, useEffect } from "react";
import AddCourseForm from "@/Components/layout/AddCourseForm";
import { SuccessFlash, ErrorFlash } from "@/Components/UI/FlashMessages";
import EditCourseForm from "@/Components/layout/EditCourseForm";
import DeleteCourseCard from "@/Components/layout/DeleteCourseCard";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteCard, setShowDeleteCard] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [flash, setFlash] = useState({
    type: "",
    show: false,
    message: "",
  });

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setShowEditForm(true);
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCourses();
      console.log(data);
      setCourses(data);
    } catch (error) {
      console.error(error);
      setFlash({
        show: true,
        type: "error",
        message: "failed to get courses , login first",
      });
    } finally {
      setLoading(false);
    }
  };
  const loadEnrolledCourses = async () => {
    try {
      const data = await enrolled();
      setEnrolledCourses(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEnroll = async (codeModule, codePresentation) => {
    try {
      await enroll(codeModule, codePresentation);
      setFlash({
        type: "success",
        message: "successfully enrolled",
        show: true,
      });
      await loadCourses();
    } catch (err) {
      console.log(err);
      setFlash({
        type: "error",
        message: "failed to enroll",
        show: true,
      });
    }
  };

  // delete course
  const handleDeleteClick = async (course) => {
    setSelectedCourse(course);
    setShowDeleteCard(true);
  };

  // get the current user role
  useEffect(() => {
    loadCourses();
    loadEnrolledCourses();

    getCurrentUser().then((res) => {
      if (res.success) {
        setUser(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!flash.show) return;

    const timer = setTimeout(() => {
      setFlash({
        type: "",
        show: false,
        message: "",
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [flash.show]);

  if (loading) {
    return <Loader />;
  }

  const sortedCourses = [...courses].sort((a, b) => {
  const aEnrolled = enrolledCourses.some(
    (c) =>
      c.codeModule === a.codeModule &&
      c.codePresentation === a.codePresentation
  );

  const bEnrolled = enrolledCourses.some(
    (c) =>
      c.codeModule === b.codeModule &&
      c.codePresentation === b.codePresentation
  );

  return Number(bEnrolled) - Number(aEnrolled);
});

  return (
    <>
      {flash.show &&
        (flash.type === "error" ? (
          <ErrorFlash content={flash.message} />
        ) : (
          <SuccessFlash content={flash.message} />
        ))}

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
                    className="fixed top-30 right-0 z-998 w-[60%] lg:w-[50%] rounded-lg p-3 
                    bg-white/40 shadow-2xl shadow-sky-900/10 backdrop-blur
                     full"
                  >
                    <AddCourseForm
                      onSuccess={async () => {
                        setOpen(false);
                        await loadCourses();
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {showEditForm && (
                  <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                      damping: 25,
                    }}
                    className="fixed top-30 right-0 z-998 w-[60%] lg:w-[50%] rounded-lg bg-white/40 p-3 shadow-2xl shadow-sky-900/10 backdrop-blur"
                  >
                    <EditCourseForm
                      course={selectedCourse}
                      onSuccess={async () => {
                        setShowEditForm(false);
                        await loadCourses();
                      }}
                      onClose={() => setShowEditForm(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {showDeleteCard && (
                  <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                      damping: 25,
                    }}
                    className="fixed top-30 right-0 z-998 w-[50%] lg:w-[50%] rounded-lg bg-transparent "
                  >
                    <DeleteCourseCard
                      course={selectedCourse}
                      onClose={() => setShowDeleteCard(false)}
                      onSuccess={async () => {
                        await loadCourses();
                        setShowDeleteCard(false);
                      }}
                    />
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
        {sortedCourses.length > 0 && (
          <section className="mt-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={`${course.codeModule}-${course.codePresentation}`}
                  course={course}
                  onEnroll={handleEnroll}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  enrolledCourses={enrolledCourses}
                />
              ))}
            </div>
          </section>
        )}
      </DashboardLayout>
    </>
  );
};

export default Courses;
