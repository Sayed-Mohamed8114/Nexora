import { FaStar } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Arwa Khalid",
    role: "Computer Science Student",
    review:
      "Nexora completely changed the way I track my academic progress. The dashboard is clean, fast, and very easy to understand.",
    rating: 5,
  },
  {
    id: 2,
    name: "Abo Bakr Samy",
    role: "Data Analyst",
    review:
      "The analytics are impressive. I can instantly see my strengths and weaknesses without spending hours analyzing grades.",
    rating: 5,
  },
  {
    id: 3,
    name: "Mahmoud Alsayed",
    role: "Software Engineering Student",
    review:
      "I love comparing my performance with global statistics. It motivates me to improve every semester and i love to be in competition .",
    rating: 5,
  },
];

export default function Reviews() {
  return (
    <section
      id="reviews"
      className="scroll-mt-28 flex w-full flex-col items-center py-10"
    >
      <h1 className="mt-6 bg-linear-to-b from-sky-900 to-black bg-clip-text p-2 text-center text-3xl font-black text-transparent sm:text-4xl lg:text-5xl">
        What Students Say
      </h1>

      <p className="mt-5 max-w-3xl text-center text-lg text-gray-600">
        Thousands of students rely on Nexora to understand their academic
        journey, improve their performance, and reach their goals faster.
      </p>

      {/* Reviews */}

      <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="group rounded-2xl bg-sky-100/90 p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-sky-200 lg:p-8"
          >
            <div className="flex text-yellow-400">
              {[...Array(review.rating)].map((_, index) => (
                <FaStar key={index} />
              ))}
            </div>

            <p className="mt-6 text-gray-600 leading-8 italic">
              "{review.review}"
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-xl font-bold text-white">
                {review.name[0]}
              </div>

              <div>
                <h3 className="font-bold text-lg">{review.name}</h3>

                <p className="text-gray-500 text-sm">{review.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}