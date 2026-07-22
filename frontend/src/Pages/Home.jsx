import Hero from "../Components/Hero/Hero";
import WhyCreated from "../Components/WhyCreated/WhyCreated";
import Navbar from "../Components/Navbar/Navbar";
import Questions from "../Components/Questions/Questions";
import Reviews from "@/Components/Reviews/Reviews";
import Footer from "../Components/Footer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-linear-to-r from-sky-100 to-sky-300 text-slate-dark">
      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-center px-4 py-4 md:py-8">
        <Navbar />
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-4 pb-12 pt-28 sm:px-6 md:gap-16 md:pt-36 lg:px-8">
        <Hero />
        <WhyCreated />
        <Questions />
        <Reviews />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
