import { useEffect, useState } from "react";
import { CreateAssessment } from "@/Services/Assessments";
import {
  SuccessFlash,
  ErrorFlash,
} from "@/Components/UI/FlashMessages";

const AddAssessments = ({
  courseName,
  codeModule,
  codePresentation,
  onSuccess,
  onClose,
}) => {
  const [assessmentType, setAssessmentType] = useState("");
  const [date, setDate] = useState("");

  const [flash, setFlash] = useState({
    message: "",
    type: "",
    show: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        codeModule,
        codePresentation,
        assessmentType,
        date,
      };

      await CreateAssessment(body);

      setFlash({
        message: "Assessment Created Successfully",
        type: "success",
        show: true,
      });

      setAssessmentType("");
      setDate("");

      setTimeout(() => {
        onSuccess?.();
      }, 800);
    } catch (err) {
      setFlash({
        message:
          err.response?.data?.message || "Failed to create assessment.",
        type: "error",
        show: true,
      });

      console.log(err.response);
      console.log(err.response?.data);
      console.log(err.response?.status);
    }
  };

  useEffect(() => {
    if (!flash.show) return;

    const timer = setTimeout(() => {
      setFlash({
        message: "",
        type: "",
        show: false,
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [flash.show]);

  return (
    <>
      {flash.show &&
        (flash.type === "error" ? (
          <ErrorFlash content={flash.message} />
        ) : (
          <SuccessFlash content={flash.message} />
        ))}

      <div className=" bg-transparent p-6 ">
        <h1 className="mb-6 text-2xl font-bold text-sky-800">
          Your are creating assessment for course (<span className="font-extrabold font-serif text-sky-950">{courseName}</span>)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Assessment Type
            </label>

            <input
              type="text"
              placeholder="Assignment, Quiz, Midterm..."
              value={assessmentType}
              onChange={(e) => setAssessmentType(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-sky-600"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Assessment Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-sky-600"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 hover:bg-green-700 transition  rounded-md bg-sky-700 py-3 font-semibold text-white duration-700"
            >
              Create Assessment
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-6 py-3 font-semibold transition hover:bg-red-600 hover:text-sky-50 duration-700 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddAssessments;