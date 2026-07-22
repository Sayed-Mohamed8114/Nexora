import ChatPage from "@/Components/ChatBot/ChatPage";
import CourseCard from "@/Components/layout/CourseCard";
import Loader from "@/Components/Loader/Loader";
import DashboardLayout from "@/mainLayout/DashboardLayout";
import { enroll } from "@/Services/courses";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { SuccessFlash, ErrorFlash } from "@/Components/UI/FlashMessages";
import { getRecommendation } from "@/Services/recommendation";

const Recommendation = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [flash, setFlash] = useState({
    type: "",
    show: false,
    message: "",
  });

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getRecommendation();
      setCourses(data?.recommendations);
    } catch (error) {
      console.error(error);
      setFlash({
        show: true,
        type: "error",
        message: "Failed to get courses, login first",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (codeModule, codePresentation) => {
    try {
      await enroll(codeModule, codePresentation);
      setFlash({
        type: "success",
        message: "Successfully enrolled",
        show: true,
      });
      await loadCourses();
    } catch (err) {
      console.log(err);
      setFlash({
        type: "error",
        message: "Failed to enroll",
        show: true,
      });
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (!flash.show) return;

    const timer = setTimeout(() => {
      setFlash({ type: "", show: false, message: "" });
    }, 2500);

    return () => clearTimeout(timer);
  }, [flash.show]);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const query = searchQuery.toLowerCase();
    return courses.filter(
      (course) =>
        course.name?.toLowerCase().includes(query) ||
        course.codeModule?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.skills?.some((skill) => skill.toLowerCase().includes(query)),
    );
  }, [courses, searchQuery]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {flash.show &&
        (flash.type === "error" ? (
          <ErrorFlash content={flash.message} />
        ) : (
          <SuccessFlash content={flash.message} />
        ))}

      <DashboardLayout>
        <div className="p-3">
          {/* Heading & Search */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-sky-900">
                Recommendation
              </h1>
              <p className="mt-2 text-slate-500">
                Search for any courses you need to learn
              </p>
            </div>

            <input
              type="text"
              placeholder="Search for course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-75 rounded-md border border-slate-light px-4 py-2 text-body text-slate-medium outline-none focus:border-primary"
            />
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="mt-12 text-center text-slate-500">
              No courses found.
            </div>
          )}

          {/* Courses Grid */}
          {filteredCourses.length > 0 && (
            <section className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={`${course.codeModule}-${course.codePresentation}`}
                    course={course}
                    onEnroll={handleEnroll}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Chatbot Toggle */}
        <motion.button
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 rounded-full bg-sky-900 px-5 py-3 text-white shadow-lg z-999 cursor-pointer hover:scale-110 duration-700"
        >
          {isChatOpen ? "Close Nexora" : "Ask Nexora"}
        </motion.button>
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 25,
              }}
              className="fixed -bottom-24 right-6 w-[90%] md:w-[50%] h-full "
            >
              <ChatPage />
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </>
  );
};

export default Recommendation;
