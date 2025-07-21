const YouMayKnowCard = () => {
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 p-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">People You May Know</h3>
          <a
            href="#"
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            See All
          </a>
        </div>
      </div>

      <div className="space-y-1 p-2">
        <div className="rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
          <div className="flex items-center">
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=150"
              alt="Emma Wilson"
              className="h-10 w-10 rounded-full border border-gray-200 object-cover"
            />
            <div className="ml-3 flex-1">
              <div className="text-sm font-semibold text-gray-900 dark:text-white/70">
                Emma Wilson
              </div>
              <div className="mt-0.5 flex items-center text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="lucide lucide-users mr-1 h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                8 mutual friends
              </div>
            </div>
            <button className="rounded-full bg-gray-100 p-1.5 text-gray-700 transition-colors hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lucide lucide-plus h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>
        </div>

        <div className="rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
          <div className="flex items-center">
            <img
              src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=150"
              alt="James Rodriguez"
              className="h-10 w-10 rounded-full border border-gray-200 object-cover"
            />
            <div className="ml-3 flex-1">
              <div className="text-sm font-semibold text-gray-900 dark:text-white/70">
                James Rodriguez
              </div>
              <div className="mt-0.5 flex items-center text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="lucide lucide-users mr-1 h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                3 mutual friends
              </div>
            </div>
            <button className="rounded-full bg-gray-100 p-1.5 text-gray-700 transition-colors hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lucide lucide-plus h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>
        </div>

        <div className="rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
          <div className="flex items-center">
            <img
              src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=150"
              alt="Olivia Taylor"
              className="h-10 w-10 rounded-full border border-gray-200 object-cover"
            />
            <div className="ml-3 flex-1">
              <div className="text-sm font-semibold text-gray-900 dark:text-white/70">
                Olivia Taylor
              </div>
              <div className="mt-0.5 flex items-center text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="lucide lucide-users mr-1 h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                1 mutual friends
              </div>
            </div>
            <button className="rounded-full bg-gray-100 p-1.5 text-gray-700 transition-colors hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lucide lucide-plus h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default YouMayKnowCard;
