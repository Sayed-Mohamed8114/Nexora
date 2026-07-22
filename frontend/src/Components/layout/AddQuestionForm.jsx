import { useEffect, useState } from "react";
import { addQuestions } from "@/Services/Assessments";
import { SuccessFlash, ErrorFlash } from "@/Components/UI/FlashMessages";

const AddQuestionForm = ({ assessment, onSuccess, onClose }) => {
  const [text, setText] = useState("");
  const [questionType, setQuestionType] = useState("MCQ");
  const [points, setPoints] = useState(1);

  const [options, setOptions] = useState(["", "", "", ""]);

  const [correctAnswer, setCorrectAnswer] = useState(0);

  const [flash, setFlash] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        text,
        questionType,
        points: Number(points),
        options: options.map((option, index) => ({
          text: option,
          isCorrect: index === correctAnswer,
        })),
      };
      console.log(correctAnswer);
      console.log(body);
      console.log(JSON.stringify(body, null, 2));

      await addQuestions(assessment.idAssessment, body);

      setFlash({
        show: true,
        type: "success",
        message: "Question added successfully",
      });

      setText("");
      setPoints(1);
      setQuestionType("MCQ");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(0);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setFlash({
        show: true,
        type: "error",
        message: err.response?.data?.message || "Failed to add question",
      });
    }
  };

  useEffect(() => {
    if (!flash.show) return;

    const timer = setTimeout(() => {
      setFlash({
        show: false,
        type: "",
        message: "",
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

      <div className="rounded-xl bg-transparent p-6">
        <h2 className="text-2xl font-bold text-sky-900">Add Question</h2>

        <p className="mt-2 text-slate-500">
          Assessment:
          <span className="ml-2 font-semibold text-sky-700">
            {assessment.assessmentType}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block font-medium">Question</label>

            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-md border p-3"
              placeholder="Enter question..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-medium">Question Type</label>

              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full rounded-md border p-3"
              >
                <option value="MCQ">MCQ</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">Points</label>

              <input
                type="number"
                min={1}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full rounded-md border p-3"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Options</h3>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={correctAnswer === index}
                    onChange={() => setCorrectAnswer(index)}
                  />

                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 rounded-md border p-3"
                    required
                  />
                </div>
              ))}
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Select the radio button beside the correct answer.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-md bg-sky-700 p-3 font-semibold text-white transition hover:bg-sky-800"
            >
              Add Question
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-6 transition hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddQuestionForm;
