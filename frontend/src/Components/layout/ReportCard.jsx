import { rateCourse } from "@/Services/reports";
import { useState } from "react";
import { Star, User, Calendar } from "lucide-react";
import { SuccessFlash, ErrorFlash } from "@/Components/UI/FlashMessages";

function ReportCard({ report, onSubmitted }) {
  const [rating, setRating] = useState(report.rating || 0);
  const [comment, setComment] = useState(report.comment || "");
  const [loading, setLoading] = useState(false);
  const [flash, setFLash] = useState({
    message: "",
    show: false,
    type: "",
  });
  const submitted = report.reportId !== null;

  const handleSubmit = async () => {
    if (rating === 0) {
      setFLash({
        message: "please choose a rate to submit it ",
        type: "error",
        show: true,
      });
    }
    try {
      await rateCourse({
        codeModule: report.codeModule,
        codePresentation: report.codePresentation,
        rating,
        comment,
      });
      setFLash({
        message: "submitted successfully , thanks for your feedback",
        type: "success",
        show: true,
      });
      onSubmitted();
    } catch (error) {
      setFLash({
        message: "something went wrong ",
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

      <div
        className="bg-linear-to-b from-sky-50 to-sky-100 dark:bg-gray-900 rounded-2xl w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.25rem)] min-h-[480px] h-auto 
    shadow-md p-6 border border-gray-200 dark:border-gray-800 space-y-5 flex flex-col justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {report.name}
          </h2>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-2">
            <User size={16} />
            <span> Tutor Name : {report.tutorName}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {report.skills?.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-sm bg-blue-100 text-sky-900 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={28}
              onClick={() => !submitted && setRating(star)}
              className={`transition cursor-pointer ${
                star <= rating ? "fill-sky-500 text-sky-500" : "text-gray-400"
              } ${submitted ? "cursor-default" : "hover:scale-110"}`}
            />
          ))}
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="bg-sky-50 w-full dark:bg-gray-800 p-4 rounded-xl">
              <p className="text-gray-700 dark:text-gray-300">
                {comment || "No comment provided."}
              </p>
            </div>

            {report.reportedAt && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={16} />
                <span>
                  Submitted on{" "}
                  {new Date(report.reportedAt).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300 rounded-full font-medium">
              ✓ Submitted
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience with this course..."
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0}
              className="w-full bg-sky-900 hover:bg-sky-700 duration-700 transition-all disabled:bg-gray-400 text-white py-3 rounded-xl font-medium cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ReportCard;
