import { useNavigate } from "react-router-dom";
import { SlLogin } from "react-icons/sl";

export default function Hero() {
  const navigate = useNavigate();

  function handleSignUP() {
    navigate("/signup");
  }

  function handleSignIn() {
    navigate("/signin");
  }
  return (
    <section className="w-[85%] items-center flex flex-col h-auto mt-20">
      <div className="flex flex-col items-center justify-center">
        <p className="text-center flex flex-col items-center justify-center">
          <span
            className="text-5xl text-center tracking-wide w-full font-extrabold font-mono 
           bg-linear-to-b bg-clip-text text-transparent from-sky-900 to-black"
          >
            Transform Learning into Measurable Success
          </span>
          <span
            className="text-2xl text-center tracking-wide mt-7 w-full font-extrabold font-mono
           bg-linear-to-r bg-clip-text text-transparent from-black  to-gray-500"
          >
            Learn Smarter. Analyze Better. Succeed Faster.
          </span>
          <span className="text-gray-700 font-bold text-xl font-serif mt-5 w-[65%]">
            Nexora empowers students, educators, and institutions with
            intelligent analytics, personalized learning insights, and real-time
            performance tracking. Make better decisions, discover opportunities,
            and achieve academic excellence <br /> all in one platform.
          </span>
        </p>
      </div>

      <div className="w-[50%] flex items-center justify-center gap-5 mt-7">
        <button
          onClick={handleSignIn}
          className="cursor-pointer bg-linear-to-r w-50 text-center from-sky-900 to-sky-500 shadow-md px-6 py-3 rounded-lg border-none border-slate-500 text-white font-medium group"
        >
          <div className="relative overflow-hidden ">
            <p className="group-hover:-translate-y-7 duration-[1.125s]  ease-[cubic-bezier(0.19,1,0.22,1)]">
              Already In?
            </p>
            <p className="absolute top-7 left-0 w-full group-hover:top-0 duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)]">
              <span className="flex w-full items-center justify-center gap-2">
                Signin
                <SlLogin />
              </span>
            </p>
          </div>
        </button>
        <button
          onClick={handleSignUP}
          className="cursor-pointer bg-linear-to-r w-50 text-center from-sky-900 to-sky-800 shadow-md px-6 py-3 rounded-lg border-none border-slate-500 text-white font-medium group"
        >
          <div className="relative overflow-hidden ">
            <p className="group-hover:-translate-y-7 duration-[1.125s]  ease-[cubic-bezier(0.19,1,0.22,1)]">
              Get Started
            </p>
            <p className="absolute top-7 left-0 w-full group-hover:top-0 duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)]">
              <span className="flex w-full items-center justify-center gap-2">
                Signup
                <SlLogin />
              </span>
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}
