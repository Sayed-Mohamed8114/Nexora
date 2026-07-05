import { useNavigate } from "react-router-dom";
import { SlLogin } from "react-icons/sl";
import { FaArrowRight, FaArrowDown } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";

export default function Hero() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  const navigateSignupPage = () => {
    setLoading(true);

    setTimeout(() => {
      navigate("/signup");
    }, 2000);
  };

  const NavigateSigninPage = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/signin");
    }, 2000);
  };

  return (
    <>
      {loading && <Loader />}

      <section
        id="home"
        className="relative scroll-mt-28 flex min-h-[calc(100vh-112px)] w-full items-center justify-center py-8 md:py-12"
      >

        <div className=" relative flex max-w-4xl z-10 flex-col items-center text-center">
          <h1 className="max-w-4xl text-4xl font-black leading-tight text-sky-950 sm:text-5xl lg:text-6xl">
            Transform Learning into Measurable Success
          </h1>

          <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-medium sm:text-lg">
            Nexora empowers students and educators with intelligent analytics,
            personalized insights, and real-time performance tracking to achieve
            academic excellence.
          </p>

          <div className="mt-8 flex w-full flex-col z-30 gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={navigateSignupPage}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-sky-700 to-sky-950 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-900/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-300"
            >
              Get Started
              <FaArrowRight />
            </button>

            <button
              onClick={NavigateSigninPage}
              className="inline-flex min-h-12  items-center justify-center gap-2 rounded-lg border border-sky-200 bg-white/80 px-6 py-3 font-semibold text-sky-950 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-400 hover:bg-white focus:outline-none focus:ring-4 focus:ring-sky-200"
            >
              Login
              <SlLogin />
            </button>
          </div>

          <div className="mt-10 grid w-full max-w-xl grid-cols-3 gap-3">
            {[
              ["10K+", "Students"],
              ["120+", "Universities"],
              ["98%", "Success rate"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-lg border border-white/70 bg-white/60 p-4 text-center shadow-sm backdrop-blur"
              >
                <p className="text-2xl font-black text-sky-800 sm:text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-[10px] text-center items-center font-semibold uppercase text-slate-medium sm:text-sm">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-14 animate-bounce text-sky-700">
            <FaArrowDown size={22} />
          </div>
        </div>
      </section>
    </>
  );
}
