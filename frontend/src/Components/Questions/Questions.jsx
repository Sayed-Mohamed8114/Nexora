const questions = [
  {
    id: 1,
    q: "Why Nexora?",
    answer:
      "Because it will help you monitor your academic progress in a friendly way.",
  },
  {
    id: 2,
    q: "Who can use it?",
    answer: "Any student can use it and track their progress.",
  },
  {
    id: 3,
    q: "What are the main features?",
    answer:
      "We have a global dashboard to see others, track everything in your academic journey.",
  },
  {
    id: 4,
    q: "Is it free?",
    answer:
      "It's completely free to make small progress, with a premium you will unlock advanced features.",
  },
];

function Questions() {
  return (
    <section
      id="faqs"
      className="scroll-mt-28 flex w-full flex-col items-center justify-center gap-3 py-10"
    >
      <h2 className="bg-linear-to-tr from-sky-900 via-sky-700 to-sky-500 bg-clip-text text-center text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
        Most Repeated Questions
      </h2>
      <div className="grid w-full grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="group overflow-hidden rounded-xl bg-linear-to-tr from-sky-800 via-sky-700 to-sky-500 text-sky-950 shadow-lg"
          >
            <div className="relative z-10 flex min-h-48 flex-col justify-between before:absolute before:-right-14 before:-top-12 before:h-28 before:w-28 before:rounded-full before:border-8 before:bg-transparent before:opacity-50 before:duration-700 group-hover:before:right-32 group-hover:before:top-28 group-hover:before:scale-125 group-hover:before:blur">
              <div className="flex h-full flex-col justify-between gap-3 p-5">
                <span className="text-start text-2xl font-bold text-sky-100">
                  {question.q}
                </span>
                <p className="w-full text-start leading-7 text-gray-200">
                  {question.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Questions;