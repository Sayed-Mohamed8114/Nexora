import comopleteLogo from "/completelogo.png";

export default function Footer() {
  return (
    <footer className="mt-10 flex w-full flex-col items-center justify-between gap-5 bg-white/50 px-5 py-6 text-center md:flex-row md:text-left">
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <img src={comopleteLogo} alt="Nexora" className="h-auto w-40" />
        <p className="text-sm text-gray-500">
          © 2026 Nexora. All rights reserved.
        </p>
      </div>

      <div className="flex flex-col items-center justify-between gap-5 text-sm text-gray-500 sm:flex-row">
        <a href="#" className="hover:text-sky-700">
          Privacy Policy
        </a>

        <a href="#" className="hover:text-sky-700">
          Terms of Service
        </a>

        <a href="#" className="hover:text-sky-700">
          Cookies
        </a>
      </div>
    </footer>
  );
}