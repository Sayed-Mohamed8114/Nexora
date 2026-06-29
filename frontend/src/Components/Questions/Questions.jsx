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
    <section className="flex h-auto w-full flex-wrap  gap-3 mb-10 py-10  items-center justify-center flex-col">
      <h2 className="bg-linear-to-tr text-5xl font-bold bg-clip-text text-transparent from-sky-900 via-sky700 to-sky-500">
        Most Repeated Questions
      </h2>
      <div className="w-full flex justify-center items-center gap-5 p-4">
        {questions.map((question) => (
          <div
            key={question.id}
            class="group overflow-hidden w-[25%] rounded-xl bg-linear-to-tr from-sky-800 via-sky-700 to-sky-500 text-sky-950"
          >
            <div class="before:duration-700 before:absolute before:w-28 before:h-28 before:bg-transparent before:blur-none before:border-8 before:opacity-50 before:rounded-full before:-right-55 before:-top-12 w-64 h-48  flex flex-col justify-between relative z-10 group-hover:before:top-28 group-hover:before:right-44 group-hover:before:scale-125 group-hover:before:blur">
              <div class=" p-4 flex flex-col justify-between gap-3 h-full">
                <span class="font-bold text-2xl text-start text-sky-100">{question.q}</span>
                <p class="subtitle text-gray-200 text-start w-full">{question.answer} </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Questions;
