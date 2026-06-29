import comopleteLogo from "/completelogo.png";


export default function Footer() {
  return (
    <footer className="mt-20 w-full bg-white/30 items-center justify-center flex p-5 ">
      <div className="justify-center items-center flex gap-3 w-[50%]">
        <img src={comopleteLogo} className="w-75 h-37.5 " />
        <p>© 2026 Nexora. All rights reserved.</p>
      </div>
      <div className="mx-auto flex  flex-col items-center justify-between gap-5 py-6 text-sm text-gray-500 md:flex-row">
        <div className="flex gap-5">
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
      </div>
    </footer>
  );
}
