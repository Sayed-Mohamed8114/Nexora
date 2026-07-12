function ProgressBar({ name, progress }) {
  return (
    <div className="w-full my-1  px-2 py-1 flex items-center justify-end gap-2 bg-white/70 rounded-md shadow-md shadow-sky-200">
      <h3 className="items-start justify-start text-sky-900 font-bold text-lg">
        {name}
      </h3>
      <div className="w-full max-w-md ">
        <div className="h-5 w-full overflow-hidden rounded-full bg-sky-200 hover:bg-green-200 transition-all duration-700 items-center justify-start flex">
          <div
            className=" flex w-full p-0.5 items-center justify-center rounded-full bg-sky-600 hover:bg-green-700 text-xs font-bold text-white transition-all duration-700"
            style={{ width: `${progress}%` }}
          >
            {progress} %
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
