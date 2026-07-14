export function SuccessFlash({ content }) {
  return (
    <div
      role="alert"
      className="bg-green-100
       dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700
        text-green-900 dark:text-green-100 p-2 rounded-lg flex items-center 
        transition duration-300 ease-in-out hover:bg-green-200
         dark:hover:bg-green-800 transform hover:scale-105
         fixed top-5 right-5 z-999 w-80 shadow-xl animate-slide-down
         "
    >
      <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 shrink-0 mr-2 text-green-600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
      <p className="text-xs font-semibold">{content}</p>
    </div>
  );
}

export function ErrorFlash({ content }) {
  return (
    <div
      role="alert"
      className="bg-red-100 fixed top-5 right-5 z-999 w-80 shadow-xl animate-slide-down
       dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700
        text-red-900 dark:text-red-100 p-2 rounded-lg flex items-center 
        transition duration-300 ease-in-out hover:bg-red-200
         dark:hover:bg-red-800 transform hover:scale-105"
    >
      <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 shrink-0 mr-2 text-red-600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
      <p className="text-xs font-semibold">{content}</p>
    </div>
  );
}
