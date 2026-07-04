import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";
import logo from "/completelogo.png";
import Loader from "../Loader/Loader";

const navLinks = [
  { label: "Home", sectionId: "home" },
  { label: "Why Nexora?", sectionId: "why-nexora" },
  { label: "FAQs", sectionId: "faqs" },
  { label: "Rates & Reviews", sectionId: "reviews" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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

  const navItem =
    "cursor-pointer rounded-md px-3 py-2 text-sm md:text-label lg:text-body font-semibold text-sky-950 transition hover:bg-sky-100 hover:text-sky-700";

  function handleSectionClick(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setIsOpen(false);
  }

  return (
    <>
      {loading && <Loader />}
      <nav className="w-full max-w-6xl rounded-2xl border border-white/70 h-[8vh]  bg-white/75 px-4 py-3 shadow-xl shadow-sky-900/10 backdrop-blur md:rounded-full md:px-6">
        <div className="flex items-center justify-between gap-4 h-full">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex shrink-0 items-center"
            aria-label="Go to home"
          >
            <img src={logo} alt="Nexora Logo" className="w-30" />
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => (
              <li
                key={item.sectionId}
                className={navItem}
                onClick={() => handleSectionClick(item.sectionId)}
              >
                {item.label}
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={NavigateSigninPage}
              className="rounded-lg border border-sky-200 bg-white px-5 py-2.5 text-sm md:text-label lg:text-body font-semibold text-sky-950 transition hover:border-sky-400 hover:text-sky-700"
            >
              Login
            </button>

            <button
              onClick={navigateSignupPage}
              className="rounded-lg bg-linear-to-r from-sky-700 to-sky-950 px-5 py-2.5 text-sm md:text-label lg:text-body font-semibold text-white shadow-md transition hover:-translate-y-0.5"
            >
              Sign up
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-200 bg-white text-sky-950 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <FaXmark /> : <FaBars />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-4 border-t border-sky-100 pt-4 md:hidden">
            <ul className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <li
                  key={item.sectionId}
                  className={navItem}
                  onClick={() => handleSectionClick(item.sectionId)}
                >
                  {item.label}
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={NavigateSigninPage}
                className="rounded-lg border border-sky-200 bg-white px-4 py-3 font-semibold text-sky-950"
              >
                Login
              </button>

              <button
                onClick={navigateSignupPage}
                className="rounded-lg bg-sky-900 px-4 py-3 font-semibold text-white"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
