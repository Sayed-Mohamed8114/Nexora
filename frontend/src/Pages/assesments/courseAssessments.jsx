import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "@/Components/Loader/Loader";
import AssessmentCard from "@/Components/layout/AssessmentsCard";
import {
  getCourseAssessments,
  getStudentAssements,
} from "@/Services/Assessments";
import { getCurrentUser } from "@/Services/user";
import { AnimatePresence, motion } from "framer-motion";
import AddQuestionForm from "@/Components/layout/AddQuestionForm";

const CourseAssessments = () => {
  const { codeModule, codePresentation } = useParams();

  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [user, setUser] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [studentResults, setStudentResult] = useState([]);

  const loadStudentsAssessments = async () => {
    try {
      const response = await getStudentAssements();
      if (response.success) {
        setStudentResult(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddQuestions = (assessment) => {
    setSelectedAssessment(assessment);
    setShowQuestionForm(true);
  };
  const loadAssessments = async () => {
    try {
      setLoading(true);

      const data = await getCourseAssessments(codeModule, codePresentation);

      setAssessments(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
    loadStudentsAssessments();
    getCurrentUser().then((res) => {
      if (res.success) {
        setUser(res.data);
      }
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <AnimatePresence>
        {showQuestionForm && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 25,
            }}
            className="fixed top-5 right-0 z-50 w-[55%] rounded-lg bg-white/80 p-3 shadow-2xl backdrop-blur"
          >
            <AddQuestionForm
              assessment={selectedAssessment}
              onClose={() => setShowQuestionForm(false)}
              onSuccess={async () => {
                setShowQuestionForm(false);
                await loadAssessments();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className=" space-y-6 flex flex-col items-center justify-start min-h-screen p-7 bg-linear-to-r top-0 from-sky-50  to-sky-200 h-auto">
        <nav
          className="w-full max-w-6xl rounded-2xl border h-[8vh]  border-white/70 
       bg-white/75 px-4 py-3 items-center justify-between flex shadow-xl shadow-sky-900/10 backdrop-blur md:rounded-full md:px-6"
        >
          <Link
            to={"/courses"}
            className="bg-linear-to-r from-sky-400 to-sky-700 text-3xl bg-clip-text text-transparent font-extrabold"
          >
            Back to courses dashboard
          </Link>
        </nav>
        {assessments.length === 0 ? (
          <div className="col-span-full py-10 text-center text-lg font-medium text-slate-500">
            No assessments yet.
          </div>
        ) : (
          assessments.map((assessment) => {
            const studentResult = studentResults.find(
              (item) => item.assessmentId === assessment.idAssessment,
            );

            return (
              <AssessmentCard
                key={assessment.idAssessment}
                assessment={assessment}
                onAddQuestions={handleAddQuestions}
                studentResult={studentResult}
                isTutor={user?.role === "Tutor"}
              />
            );
          })
        )}
      </div>
    </>
  );
};

export default CourseAssessments;
