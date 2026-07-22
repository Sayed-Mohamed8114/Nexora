import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "@/Components/Loader/Loader";
import { getAssesmentQuestions } from "@/Services/Assessments";
import { getCurrentUser } from "@/Services/user";
import QuestionCard from "@/Components/layout/QuestionCard";

const QuestionsPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);

  const loadQuestions = async () => {
    try {
      setLoading(true);

      const data = await getAssesmentQuestions(assessmentId);
      setQuestions(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const res = await getCurrentUser();

      if (res.success) {
        setUser(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadQuestions();
    loadUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-sky-100 to-sky-200 p-8">
      {/* Navbar */}
      <nav
        className="mx-auto mb-8 flex h-[7vh] w-full max-w-6xl items-center justify-between rounded-full
        border border-white/70 bg-white/75 px-6 shadow-xl shadow-sky-900/10 backdrop-blur"
      >
        <Link
          to="/courses"
          className="bg-linear-to-r from-sky-400 to-sky-700 bg-clip-text text-2xl font-extrabold text-transparent"
        >
          Return to Courses
        </Link>

        <button
          onClick={() => navigate(-1)}
          className="bg-linear-to-r from-sky-400 to-sky-700 bg-clip-text text-2xl font-extrabold text-transparent cursor-pointer"
        >
          Return to Assessments
        </button>
      </nav>

      {/* Empty State */}
      {questions.length === 0 ? (
        <div className="mx-auto mt-24 max-w-3xl rounded-3xl bg-transparant p-12 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-sky-900">
            No Questions Yet
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            {user?.role === "Tutor"
              ? "This assessment doesn't contain any questions yet. Start by adding your first question."
              : "This assessment doesn't contain any questions yet. Please check back later."}
          </p>

          {user?.role === "Tutor" && (
            <button
              onClick={() => navigate(-1)}
              className="mt-8 rounded-xl bg-green-700 px-8 py-3 font-semibold text-white transition duration-300 hover:bg-green-600"
            >
              Add First Question
            </button>
          )}
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;