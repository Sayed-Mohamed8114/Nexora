import { GrAnalytics } from "react-icons/gr";
import { FaChalkboardTeacher } from "react-icons/fa";
import { SiLevelsdotfyi } from "react-icons/si";
import Loader from "../../Components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import { register } from "../../Services/AuthServices";
import { ErrorFlash, SuccessFlash } from "@/Components/UI/FlashMessages";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState({
    show: false,
    type: "",
    message: "",
  });
  // formData
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.role
    ) {
      setFlash({
        show: true,
        type: "error",
        message: "please fill all the fields first",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const message1 = "Passwords do not match.";
      setFlash({
        show: true,
        type: "error",
        message: message1,
      });
      return;
    }
    try {
      setLoading(true);
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: Number(formData.role),
      };
      await register(payload);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
      });

      setFlash({
        show: true,
        type: "success",
        message: "Acc created successfully, signin to access dasboard",
      });
      setTimeout(() => {
        navigate("/signin");
      }, 2700);
    } catch (error) {
      const message2 =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to create your account.";
      setFlash({
        show: true,
        type: "error",
        message: message2,
      });
    } finally {
      setLoading(false);
    }
  };

  //habdle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      // this line to take the name of the input field automatically
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  // flash rendering
  useEffect(() => {
    if (!flash.show) return;

    const timer = setTimeout(() => {
      setFlash((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2500);
    return () => {
      clearTimeout(timer);
    };
  }, [flash.show]);

  const handleGoHome = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/");
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
         flex-col-reverse lg:flex-row md:h-[90%] lg:h-[85%] 
         w-[95%] items-center justify-center lg:justify-start rounded-2xl
          bg-white/50 px-4 py-10 shadow-xl shadow-sky-900/10 backdrop-blur sm:h-[80%] sm:w-[70%]"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/10"></div>

          <div
            className="relative hidden h-full w-[90%] lg:w-[45%] flex-col md:h-[15%] 
           lg:h-auto justify-center overflow-hidden rounded-2xl p-10 text-sky-900 md:flex"
          >
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
            <button
              className="flex p-2 gap-3 text-[9px] md:text-xl
             text-sky-800 font-bold mt-10 items-center text-start 
             justify-center lg:justify-start cursor-pointer"
            >
              <IoHome />
              <a onClick={handleGoHome} className="text-[9px] lg:text-[17px] ">
                Return to home page ?
              </a>
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full md:w-[50%] md:h-[95%] rounded-2xl bg-transparent
           p-1 text-sky-900 overflow-y-auto max-h-full"
          >
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="relative h-4 w-4">
                  <span className="absolute inset-0 rounded-full bg-sky-800"></span>
                  <span className="absolute inset-0 animate-ping rounded-full bg-sky-800"></span>
                </div>

                <h1 className="font-serif text-3xl font-semibold">Register</h1>
              </div>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row gap-3">
              <div className="relative w-full">
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  name="firstName"
                  placeholder=" "
                  className="peer w-full rounded-lg border border-gray-300 bg-sky-100 px-3 pb-2 pt-6 font-serif font-semibold text-sky-900 outline-none transition focus:border-sky-400"
                />
                <label className="absolute left-3 top-2 text-xs text-sky-800 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-sky-700">
                  First Name
                </label>
              </div>

              <div className="relative w-full">
                <input
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  placeholder=" "
                  name="lastName"
                  className="peer w-full rounded-lg border border-gray-300 bg-sky-100 px-3 pb-2 pt-6 font-serif font-semibold text-sky-900 outline-none transition focus:border-sky-400"
                />
                <label className="absolute left-3 top-2 text-xs text-sky-800 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-sky-700">
                  Last Name
                </label>
              </div>
            </div>

            <div className="relative mb-4">
              <input
                type="email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                placeholder=" "
                className="peer w-full rounded-lg border border-gray-300 bg-sky-100 px-3 pb-2 pt-6 font-serif font-semibold text-sky-900 outline-none transition focus:border-sky-400"
              />
              <label className="absolute left-3 top-2 text-xs text-sky-800 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-sky-700">
                Email
              </label>
            </div>

            <div className="relative mb-4">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="peer w-full cursor-pointer rounded-lg border border-gray-300 bg-sky-100 px-3 pb-2 pt-6 font-serif font-semibold text-sky-900 outline-none transition focus:border-sky-400"
              >
                <option value="" disabled hidden></option>
                <option value={0}>Student</option>
                <option value={1}>Tutor</option>
              </select>

              <label className="absolute left-3 top-2 text-start text-xs text-sky-950 transition-all peer-focus:text-sky-700">
                Role
              </label>
            </div>

            <div className="relative mb-4">
              <input
                type="password"
                placeholder=" "
                value={formData.password}
                name="password"
                onChange={handleChange}
                className="peer w-full rounded-lg border border-gray-300 bg-sky-100 px-3 pb-2 pt-6 font-serif font-semibold text-sky-900 outline-none transition focus:border-sky-400"
              />
              <label className="absolute left-3 top-2 text-xs text-sky-800 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-sky-700">
                Password
              </label>
            </div>

            <div className="relative mb-6">
              <input
                type="password"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                className="peer w-full rounded-lg border border-gray-300 bg-sky-100 px-3 pb-2 pt-6 font-serif font-semibold text-sky-900 outline-none transition focus:border-sky-400"
              />
              <label className="absolute left-3 top-2 text-xs text-sky-800 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-sky-700">
                Confirm Password
              </label>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-sky-900 px-4 py-3 font-semibold text-white w-full cursor-pointer hover:scale-90 duration-600 hover:bg-sky-950"
            >
              Submit
            </button>

            <p className="mt-5 text-center text-sm text-sky-700">
              Already have an account?{" "}
              <span
                onClick={NavigateSigninPage}
                className="cursor-pointer text-sky-900 hover:underline"
              >
                Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
