import Hero from "../Components/Hero/Hero";
import WhyCreated from "../Components/WhyCreated/WhyCreated";
import Navbar from "../Components/Navbar/Navbar";

export default function Home() {
  return (
    <div className="items-center justify-center h-auto flex-col flex  overflow-x-hidden bg-linear-to-b from-sky-900  to-white w-full">
      <Navbar/>
      <main className="items-center justify-center flex-col flex h-auto overflow-x-hidden">
        <Hero />
        <WhyCreated />
      </main>
    </div>
  );
}
