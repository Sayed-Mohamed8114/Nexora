import DashboardLayout from "@/mainLayout/DashboardLayout";
import ProgressCard from "@/Components/layout/ProgressCard";
import PomodoroClock from "@/Components/layout/PomodoroClock";
import TodoList from "@/Components/layout/ToDoList";
import MainChart from "@/Components/layout/MainChart";
import ProgressBar from "@/Components/layout/ProgressBar";

const MyDashboard = () => {
  return (
    <DashboardLayout>
      <div className="w-full h-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="col-span-1 xl:col-span-9 border-white/70 shadow-xl shadow-sky-900/10 backdrop-blur text-sky-950 py-5 rounded-xl">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 w-full">
              <MainChart />
            </div>
            <ProgressCard />
          </div>
          <div className="flex px-2 py-1.5 flex-col items-start justify-center mt-5 w-full">
            <h2 className="font-extrabold text-3xl bg-linear-to-r mb-2 from-sky-700 to-sky-950 shadow-2xl shadow-white bg-clip-text text-transparent font-serif ">
              SKills Progress
            </h2>
            <div className="flex-1 overflow-y-auto pr-3 space-y-3 w-full lg:w-[50%] xl:w-[45%] max-h-[35vh] no-scrollbar cursor-grab">
              <ProgressBar name={"Python"} progress={85} />
              <ProgressBar name={"Css"} progress={50} />
              <ProgressBar name={"Html"} progress={70} />
              <ProgressBar name={".Net"} progress={90} />
              <ProgressBar name={"Node"} progress={15} />
              <ProgressBar name={"MongoDB"} progress={45} />
              <ProgressBar name={"Django"} progress={70} />
              <ProgressBar name={"Fast api"} progress={80} />
              <ProgressBar name={"Tailwind"} progress={95} />
              <ProgressBar name={"Bootstrap"} progress={40} />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-1 xl:col-span-3 p-2 rounded-xl flex flex-col md:flex-row xl:flex-col gap-6">
          <div className="flex-1 w-full">
            <TodoList />
          </div>
          <div className="flex-1 w-full max-w-md xl:max-w-none">
            <PomodoroClock />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyDashboard;
