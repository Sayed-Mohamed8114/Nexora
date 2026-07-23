import { useEffect, useState } from "react";

function PomodoroClock() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      } else if (minutes > 0) {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
      } else if (isBreak) {
        setMinutes(25);
        setSeconds(0);
        setIsBreak(false);
      } else {
        const newSessions = sessions + 1;
        setSessions(newSessions);
        setMinutes(newSessions % 4 === 0 ? 15 : 5);
        setSeconds(0);
        setIsBreak(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, isBreak, sessions]);

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(25);
    setSeconds(0);
    setIsBreak(false);
    setSessions(0);
  };

  return (
    <div className="relative flex h-[320px] w-full flex-col items-center justify-between overflow-hidden rounded-md bg-gray-700 p-5 text-gray-50 shadow-inner shadow-white sm:h-80 sm:p-6">
      <div className="z-10 text-base font-bold text-sky-50 sm:text-lg">
        {isBreak ? "Break Time" : "Focus Time"}
      </div>

      <div className="z-10 flex flex-col items-center leading-none">
        <div className="text-5xl font-extrabold text-sky-200/70 sm:text-7xl">
          {String(minutes).padStart(2, "0")}
        </div>
        <div className="text-5xl font-extrabold text-sky-200/70 sm:text-6xl">
          {String(seconds).padStart(2, "0")}
        </div>
      </div>

      <div className="z-10 text-center text-sm text-gray-200">
        Sessions Completed: {sessions}
      </div>

      <div className="z-10 flex w-full gap-3 sm:w-auto">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="flex-1 rounded-md bg-sky-800 px-4 py-2 text-white duration-300 hover:bg-sky-950 sm:flex-none"
            type="button"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="flex-1 rounded-md bg-sky-400 px-4 py-2 duration-300 hover:bg-sky-600 sm:flex-none"
            type="button"
          >
            Pause
          </button>
        )}

        <button
          onClick={resetTimer}
          className="flex-1 rounded-md bg-black px-4 py-2 text-white duration-300 hover:bg-gray-600 sm:flex-none"
          type="button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default PomodoroClock;
