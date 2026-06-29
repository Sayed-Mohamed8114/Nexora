import { useNavigate } from "react-router-dom";
import { SlLogin } from "react-icons/sl";
import { FaArrowDown } from "react-icons/fa6";



export default function Hero() {

  
  const navigate = useNavigate();

  return (
    <section className="relative flex h-[90vh] w-[85%] items-center justify-center overflow-hidden">

      <div className="absolute inset-0 -z-20">




        <div className="float-1 absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-400/30 blur-3xl" />

        <div className="float-2 absolute right-0 top-24 h-112 w-md rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="float-3 absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-700/20 blur-3xl" />
      </div>


      <div className="z-10 flex flex-col items-center text-center">




        <h1 className="bg-linear-to-b from-sky-900 to-black bg-clip-text text-6xl font-black tracking-wide text-transparent">
          Transform Learning into
          <br />
          Measurable Success
        </h1>


        <h2 className="mt-7 bg-linear-to-r from-black to-gray-500 bg-clip-text text-2xl font-bold tracking-wide text-transparent">
          Learn Smarter. Analyze Better. Succeed Faster.
        </h2>


        <p className="mt-6 max-w-4xl text-xl font-serif leading-9 text-gray-700">
          Nexora empowers students, educators, and institutions with
          intelligent analytics, personalized learning insights, and real-time
          performance tracking. Make better decisions, discover opportunities,
          and achieve academic excellence—all in one platform.
        </p>

        {/* Buttons */}

        <div className="mt-10 flex gap-6">
          <button
            onClick={() => navigate("/signin")}
            className="group rounded-xl bg-linear-to-r from-sky-900 to-sky-500 px-8 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-105 "
          >
            <div className="relative overflow-hidden">
              <p className="transition-all duration-500 group-hover:-translate-y-8">
                Already In?
              </p>

              <p className="absolute left-0 top-8 flex w-full items-center justify-center gap-2 transition-all duration-500 group-hover:top-0">
                Sign In
                <SlLogin />
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="group rounded-xl bg-linear-to-r from-sky-900 to-sky-800 px-8 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-105 "
          >
            <div className="relative overflow-hidden">
              <p className="transition-all duration-500 group-hover:-translate-y-8">
                Get Started
              </p>

              <p className="absolute left-0 top-8 flex w-full items-center justify-center gap-2 transition-all duration-500 group-hover:top-0">
                Sign Up
                <SlLogin />
              </p>
            </div>
          </button>
        </div>

        {/* Statistics */}

        <div className="mt-16 flex gap-16">
          <div>
            <h2 className="text-4xl font-bold text-sky-700">10K+</h2>
            <p className="text-gray-600">Students</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-sky-700">120+</h2>
            <p className="text-gray-600">Universities</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-sky-700">98%</h2>
            <p className="text-gray-600">Success Rate</p>
          </div>
        </div>

        <div className="mt-14 animate-bounce text-sky-700">
          <FaArrowDown size={22} />
        </div>
      </div>
    </section>
  );
}