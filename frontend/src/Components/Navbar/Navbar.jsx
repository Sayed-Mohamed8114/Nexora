import { useNavigate } from "react-router-dom";
import comopleteLogo from "/completelogo.png";

export default function Navbar() {
  {
    /TODO/;
  }
  {
    /*
    make the loader to navigate between pages later 
    */
  }

  const navigate = useNavigate();

  function handleSignUP() {
    navigate("/signup");
  }

  function handleSignIn() {
    navigate("/signin");
  }

  const navItem =
    "relative cursor-pointer text-lg font-semibold text-sky-950 transition-all duration-500 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-700 hover:after:w-full";

  return (
    <nav className="mt-4 h-[8vh] w-[85%] max-w-7xl rounded-2xl bg-white/20 px-5 text-white backdrop-blur-md flex items-center justify-between">
      <div className="flex items-center justify-center">
        <img src={comopleteLogo} alt="Nexora Logo" className="w-60" />
      </div>

      <ul className="flex items-center gap-5">
        <li className={navItem}>Home</li>
        <li className={navItem}>How It Works</li>
        <li className={navItem}>Rates & Reviews</li>
        <li className={navItem}>FAQs</li>
      </ul>

      <div className="flex gap-3">
        <button
          onClick={handleSignIn}
          className="cursor-pointer bg-linear-to-r from-sky-700 to-sky-900 shadow-md px-6 py-3 rounded-lg border-none border-slate-500 text-white font-medium group"
        >
          <div className="relative overflow-hidden">
            <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
              Again?
            </p>
            <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
              Login
            </p>
          </div>
        </button>

        <button
          onClick={handleSignUP}
          className="cursor-pointer bg-linear-to-r w-25 text-center from-sky-700 to-sky-950 shadow-md px-6 py-3 rounded-lg border-none border-slate-500 text-white font-medium group"
        >
          <div className="relative overflow-hidden w-full items-center justify-center">
            <p className="group-hover:-translate-y-7 items-center duration-[1.125s]  ease-[cubic-bezier(0.19,1,0.22,1)]">
              New?
            </p>
            <p className="absolute top-7 items-center left-0 group-hover:top-0 text-center duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
              Signup
            </p>
          </div>
        </button>
      </div>
    </nav>
  );
}
