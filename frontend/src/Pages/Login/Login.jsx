import { GrAnalytics } from "react-icons/gr";
import { FaChalkboardTeacher } from "react-icons/fa";
import { SiLevelsdotfyi } from "react-icons/si";
import Loader from "../../Components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import { login } from "../../Services/AuthServices";
import { ErrorFlash, SuccessFlash } from "@/Components/UI/FlashMessages";

export default function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flash, setFlash] = useState({
    type: "",
    message: "",
    show: false,
  });

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  useEffect(() => {
    if (!flash.show) return;

    const timer = setTimeout(() => {
      setFlash((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2500);

    return () => clearTimeout(timer);
  }, [flash.show]);

  const handleGoHome = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const navigateSignupPage = () => {
    setLoading(true);

    setTimeout(() => {
      navigate("/signup");
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFlash({
        show: true,
        type: "error",
        message: "Please enter your email and password.",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await login({
        email,
        password,
      });
      const token = response.token;
      localStorage.setItem("token", token);
      setEmail("");
      setPassword("");
      setFlash({
        show: true,
        type: "success",
        message: "Login successful. Redirecting to your dashboard...",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2800);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Login failed.";

      setFlash({
        show: true,
        type: "error",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {flash.show &&
        (flash.type === "error" ? (
          <ErrorFlash content={flash.message} />
        ) : (
          <SuccessFlash content={flash.message} />
        ))}

      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-linear-to-r from-sky-100 to-sky-300">
        <h1 className="absolute -translate-y-80 md:-translate-y-97 select-none bg-linear-to-r from-sky-800/40 to-sky-800/80 bg-clip-text text-8xl font-black font-serif text-transparent md:text-9xl">
          Nexora
        </h1>

        <div
          className="relative z-10 flex
         flex-col-reverse lg:flex-row md:h-[70%] lg:h-[85%] 
         w-[95%] items-center justify-center lg:justify-start rounded-2xl
          bg-white/50 px-4 py-10 shadow-xl shadow-sky-900/10 backdrop-blur sm:h-[80%] sm:w-[70%]"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/10"></div>

          <div className="relative hidden h-full w-[90%] lg:w-[45%] flex-col items- justify-center overflow-hidden rounded-2xl p-10 text-sky-900 md:flex">
            <div className="flex flex-col">
              <h2 className="items-center lg:items-start justify-center font-extrabold  leading-tight flex lg:flex-col">
                <span className="flex items-center gap-2 text-xl lg:text-6xl">
                  <FaChalkboardTeacher className="text-sky-700" />
                  Learn.
                </span>

                <span className="flex items-center gap-2 text-xl lg:text-6xl">
                  <GrAnalytics className="text-sky-700" />
                  Analyze.
                </span>

                <span className="flex items-center gap-2 text-xl lg:text-6xl">
                  <SiLevelsdotfyi className="text-sky-700" />
                  Improve.
                </span>
              </h2>

              <p className="mt-6 hidden lg:flex text-sm sm:text-lg leading-8 text-gray-500">
                Nexora helps students monitor their academic performance,
                visualize progress, and receive smart insights that support
                better learning decisions.
              </p>
            </div>
            <button className="flex p-2 gap-3 text-[9px] md:text-xl text-sky-800 font-bold mt-10 items-center text-start justify-center lg:justify-start cursor-pointer">
              <IoHome />
              <a onClick={handleGoHome} className="text-[9px] lg:text-xl">
                Return to home page ?
              </a>
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full md:w-[50%] rounded-2xl bg-transparent p-1 text-sky-900"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="relative h-4 w-4">
                  <span className="absolute inset-0 rounded-full bg-sky-800"></span>
                  <span className="absolute inset-0 animate-ping rounded-full bg-sky-800"></span>
                </div>

                <h1 className="font-serif text-3xl font-semibold">Sign In</h1>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Welcome back! Please sign in to continue.
              </p>
            </div>

            <div className="relative mb-5">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder=" "
                className="peer w-full rounded-lg border border-gray-300 bg-sky-100 px-3 pb-2 pt-6 font-serif font-semibold text-sky-900 outline-none transition focus:border-sky-400"
              />
              <label className="absolute left-3 top-2 text-xs text-sky-800 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-sky-700">
                Email
              </label>
            </div>

            <div className="relative mb-6">
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                placeholder=" "
                className="peer w-full rounded-lg border border-gray-300 bg-sky-100 px-3 pb-2 pt-6 font-serif font-semibold text-sky-900 outline-none transition focus:border-sky-400"
              />
              <label className="absolute left-3 top-2 text-xs text-sky-800 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-sky-700">
                Password
              </label>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-sky-900 px-4 py-3 font-semibold text-white w-full cursor-pointer hover:scale-90 duration-600 hover:bg-sky-950 "
            >
              Sign In
            </button>

            <p className="mt-6 text-center text-sm  text-sky-700">
              Already have an account?{" "}
              <span
                onClick={navigateSignupPage}
                className="cursor-pointer text-sky-900 hover:underline"
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
