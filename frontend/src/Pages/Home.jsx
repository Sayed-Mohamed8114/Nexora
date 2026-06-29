import Hero from "../Components/Hero/Hero";
import WhyCreated from "../Components/WhyCreated/WhyCreated";
import Navbar from "../Components/Navbar/Navbar";
import Questions from '../Components/Questions/Questions'
import Reviews from "@/Components/Reviews/Reviews";
import Footer from "../Components/Footer/Footer"
export default function Home() {
  return (
    <div className="items-center justify-center h-auto flex-col flex  bg-linear-to-r from-sky-100  to-sky-300 w-full">
      <Navbar/>
      <main className="items-center justify-center flex-col flex h-auto overflow-x-hidden">
        <Hero />
        <WhyCreated />
        <Questions/>
        <Reviews/>
      </main>
      <Footer/>
    </div>
  );
}
