import { rateCourse } from "@/Services/reports";
import { useState } from "react";
import { Star, User, Calendar } from "lucide-react";
import { SuccessFlash, ErrorFlash } from "@/Components/UI/FlashMessages";

function ReportCard({ report, onSubmitted }) {
  const [rating, setRating] = useState(report.rating || 0);
  const [comment, setComment] = useState(report.comment || "");
  const [loading, setLoading] = useState(false);

  const [flash, setFlash] = useState({
    message: "",
    show: false,
    type: "",
  });

  const submitted = report.reportId !== null;

  const handleSubmit = async () => {
    if (rating === 0) {
      setFlash({
        message: "Please choose a rating before submitting.",
        type: "error",
        show: true,
      });
      return;
    }

    try {
      setLoading(true);

      await rateCourse({
        codeModule: report.codeModule,
        codePresentation: report.codePresentation,
        rating,
        comment,
      });

      setFlash({
        message: "Submitted successfully. Thanks for your feedback!",
        type: "success",
        show: true,
      });

      onSubmitted();
    } catch (error) {
      setFlash({
        message: "Something went wrong.",
        type: "error",
        show: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {flash.show &&
        (flash.type === "error" ? (
          <ErrorFlash content={flash.message} />
        ) : (
          <SuccessFlash content={flash.message} />
        ))}

      <div className="w-full rounded-3xl border border-gray-200 dark:border-gray-800 bg-linear-to-r from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 p-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Side */}
          <div className="xl:w-1/3 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {report.name}
              </h2>

              <div className="flex items-center gap-2 mt-4 text-gray-600 dark:text-gray-400">
                <User size={18} />
                <span className="font-medium">Tutor: {report.tutorName}</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {report.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-sky-100 text-sky-900 dark:bg-sky-900/30 dark:text-sky-300 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {submitted && report.reportedAt && (
              <div className="flex items-center gap-2 mt-8 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={16} />
                <span>
                  Submitted on{" "}
                  {new Date(report.reportedAt).toLocaleDateString()}
                </span>
              </div>
            )}

            {submitted && (
              <div className="mt-8  inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-5 py-2 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-semibold">
                ✓ Feedback Submitted
              </div>
            )}
          </div>

          {/* Middle */}
          <div className="xl:w-1/4 flex flex-col  justify-start items-start xl:justify-center xl:items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
                Course Rating
              </h3>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={36}
                    onClick={() => !submitted && setRating(star)}
                    className={`transition ${
                      submitted
                        ? "cursor-default"
                        : "cursor-pointer hover:scale-110"
                    } ${
                      star <= rating
                        ? "fill-sky-500 text-sky-500"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
            {/*here*/}
          </div>

          {/* Right */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Feedback
            </h3>

            {submitted ? (
              <div className="rounded-2xl bg-sky-50 dark:bg-gray-800 p-6 min-h-45">
                <p className="leading-7 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {comment || "No comment provided."}
                </p>
              </div>
            ) : (
              <>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={7}
                  placeholder="Tell us about your experience with this course..."
                  className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 resize-none outline-none focus:ring-2 focus:ring-sky-500"
                />

                <button
                  onClick={handleSubmit}
                  disabled={loading || rating === 0}
                  className="mt-5 w-full rounded-2xl bg-sky-900 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportCard;
