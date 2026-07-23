function ProgressBar({ name, progress }) {
  const value = Math.min(100, Math.max(0, Math.round(Number(progress) || 0)));

  return (
    <div className="my-1 flex w-full flex-col gap-2 rounded-md bg-white/70 px-2 py-2 shadow-md shadow-sky-200 sm:flex-row sm:items-center sm:justify-end">
      <h3 className="min-w-0 break-words text-base font-bold text-sky-900 sm:w-40 sm:text-lg">
        {name}
      </h3>
      <div className="w-full min-w-0 flex-1">
        <div className="flex h-5 w-full items-center justify-start overflow-hidden rounded-md bg-sky-200 transition-all duration-700 hover:bg-green-200">
          <div
            className="flex h-full min-w-8 items-center justify-center rounded-md bg-sky-600 p-0.5 text-xs font-bold text-white transition-all duration-700 hover:bg-green-700"
            style={{ width: `${value}%` }}
          >
            {value}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
