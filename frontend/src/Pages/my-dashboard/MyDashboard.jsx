import DashboardLayout from "@/mainLayout/DashboardLayout";
import ProgressCard from "@/Components/layout/ProgressCard";
import PomodoroClock from "@/Components/layout/PomodoroClock";
import TodoList from "@/Components/layout/ToDoList";
import MainChart from "@/Components/layout/MainChart";
import ProgressBar from "@/Components/layout/ProgressBar";

const MyDashboard = () => {
  return (
    <DashboardLayout>
      <div className="w-full h-[89vh] grid grid-cols-12 gap-6">
        <div className="col-span-9 border-white/70 shadow-xl  shadow-sky-900/10 backdrop-blur text-sky-950 py-5 rounded-xl">
          <div className="flex gap-2">
            <MainChart />
            <ProgressCard />
          </div>
          <div className="flex px-2 py-1.5 flex-col items-start justify-center mt-5 w-full">
            <h2 className="font-extrabold text-3xl bg-linear-to-r mb-2 from-sky-700 to-sky-950 shadow-2xl shadow-white bg-clip-text text-transparent  font-serif ">
              SKills Progress
            </h2>
            <div className="flex-1 overflow-y-auto pr-3 space-y-3 w-[45%] max-h-[35vh] no-scrollbar cursor-grab">
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
        <div className="col-span-3 p-2 rounded-xl flex flex-col gap-6">
          <TodoList />
          <PomodoroClock />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyDashboard;
