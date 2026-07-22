import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "@/Components/Loader/Loader";
import {
  getAssesmentQuestions,
  submitAnswers,
} from "@/Services/Assessments";
import {
  SuccessFlash,
  ErrorFlash,
} from "@/Components/UI/FlashMessages";

export default function TakeAssessment() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const [flash, setFlash] = useState({
    type: "",
    show: false,
    message: "",
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await getAssesmentQuestions(assessmentId);

      if (response.success) {
        setQuestions(response.data);
      }
    } catch (err) {
      setFlash({
        message: "Failed to load assessment.",
        type: "error",
        show: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionId) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setFlash({
        message: "Please answer all questions first.",
        type: "error",
        show: true,
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        answers: Object.entries(answers).map(([questionId, optionId]) => ({
          questionId: Number(questionId),
          optionId,
        })),
      };

      const response = await submitAnswers(assessmentId, payload);

      setResult(response);

      setSubmitted(true);

      setFlash({
        message: response.message || "Assessment submitted successfully!",
        type: "success",
        show: true,
      });
    } catch (err) {
      setFlash({
        message:
          err.response?.data?.message ||
          "Failed to submit assessment.",
        type: "error",
        show: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <>
      {flash.show &&
        (flash.type === "error" ? (
          <ErrorFlash content={flash.message} />
        ) : (
          <SuccessFlash content={flash.message} />
        ))}

      <div className="mx-auto max-w-5xl p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sky-900">
            Take Assessment
          </h1>

          <p className="mt-2 text-slate-600">
            Answer all questions, then submit your assessment.
          </p>

          <p className="mt-3 text-sm font-medium text-sky-700">
            Answered {Object.keys(answers).length} / {questions.length}
          </p>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center text-slate-500 shadow">
            No questions available.
          </div>
        ) : (
          <>
            <div className="space-y-6 p-10">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-xl border bg-white p-6 shadow-sm"
                >
                  <h2 className="mb-5 text-lg font-semibold">
                    Question {index + 1}
                  </h2>

                  <p className="mb-6 text-slate-700">
                    {question.text}
                  </p>

                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                          submitted
                            ? "cursor-default bg-slate-100"
                            : "hover:bg-sky-50"
                        }`}
                      >
                        <input
                          type="radio"
                          disabled={submitted}
                          name={`question-${question.id}`}
                          checked={
                            answers[question.id] === option.id
                          }
                          onChange={() =>
                            handleSelectOption(
                              question.id,
                              option.id
                            )
                          }
                        />

                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={submitted || submitting}
                className="w-full rounded-lg bg-sky-700 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitted
                  ? "Assessment Submitted"
                  : submitting
                  ? "Submitting..."
                  : "Submit Assessment"}
              </button>
            </div>

            {result && (
              <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 shadow">
                <h2 className="mb-4 text-2xl font-bold text-green-800">
                  Assessment Result
                </h2>

                <div className="space-y-2 text-lg">
                  <p>
                    <strong>Score:</strong> {result.score}%
                  </p>

                  <p>
                    <strong>Correct Answers:</strong>{" "}
                    {result.correctAnswers} / {result.totalQuestions}
                  </p>

                  <p>
                    <strong>Message:</strong> {result.message}
                  </p>
                  <button onClick={()=>{navigate(-1)}} className=" mt-5 w-[50%] font-extrabold font-serif bg-sky-800 p-2 rounded-md hover:bg-sky-900 transition duration-700 cursor-pointer text-sky-50">
                    Back to assessments 
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}