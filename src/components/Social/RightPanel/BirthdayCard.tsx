const BirthdayCard = () => {
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="lucide lucide-gift h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="8" width="18" height="4" rx="1" />
              <path d="M12 8v13" />
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Birthdays</h3>
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-medium">David Kim</span> and{" "}
              <span className="font-medium">2 others</span> have birthdays
              today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
