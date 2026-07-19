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
      } else {
        if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          if (isBreak) {
            // Break finished → Work
            setMinutes(25);
            setSeconds(0);
            setIsBreak(false);
          } else {
            // Work finished → Break
            const newSessions = sessions + 1;
            setSessions(newSessions);

            if (newSessions % 4 === 0) {
              setMinutes(15); // Long break
            } else {
              setMinutes(5); // Short break
            }

            setSeconds(0);
            setIsBreak(true);
          }
        }
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
    <div
      className="group overflow-hidden relative rounded-2xl shadow-inner shadow-white flex flex-col
     justify-between items-center w-full h-80 bg-gray-700 text-gray-50 p-6"
    >
      {/* Background Glow */}
      <div className="after:absolute after:w-16 after:h-16 after:bg-white after:rounded-full after:blur-3xl after:bottom-24 after:right-10 before:absolute before:w-16 before:h-16 before:bg-sky-400 before:rounded-full before:blur-3xl before:top-10 before:left-8"></div>

      {/* Mode */}
      <div className="z-10 text-lg font-bold text-sky-50">
        {isBreak ? "☕ Break Time" : " Focus Time"}
      </div>

      {/* Timer */}
      <div className="z-10 flex flex-col items-center">
        <div className="text-7xl font-extrabold tracking-wider text-sky-200/60">
          {String(minutes).padStart(2, "0")}
        </div>

        <div className="text-6xl font-extrabold text-sky-200/60">
          {String(seconds).padStart(2, "0")}
        </div>
      </div>

      {/* Sessions */}
      <div className="z-10 text-sm text-gray-200">
        Sessions Completed: {sessions}
      </div>

      {/* Buttons */}
      <div className="z-10 flex gap-3">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="px-4 py-2 rounded-lg bg-sky-800 hover:bg-sky-950 text-white duration-300"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="px-4 py-2 rounded-lg bg-sky-400 hover:bg-sky-600 duration-300"
          >
            Pause
          </button>
        )}

        <button
          onClick={resetTimer}
          className="px-4 py-2 rounded-lg bg-black hover:bg-gray-600 text-white duration-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default PomodoroClock;
