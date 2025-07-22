import { SearchIcon } from "@/assets/icons";
import React from "react";

type User = {
  initials: string;
  name: string;
};

type HistoryMessageProps = {
  users: User[];
};

const HistoryMessage: React.FC<HistoryMessageProps> = ({ users }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-100 p-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Active Now</h3>
          <div className="flex space-x-2">
            {/* Users Icon */}
            <button className="rounded-full p-1 text-gray-500 hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lucide lucide-users h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </button>

            {/* X Icon */}
            <button className="rounded-full p-1 text-gray-500 hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lucide lucide-x h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="space-y-1 p-2">
        <div className="pm-32 relative mb-8 w-full max-w-[150px] lg:max-w-[300px]">
          <input
            type="search"
            placeholder="Search"
            className="flex h-10 w-full items-center gap-3.5 rounded-full border bg-gray-100 py-3 pl-[53px] pr-5 outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:bg-gray-700 dark:text-white/90 dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:hover:text-dark-6 dark:focus-visible:border-primary"
          />

          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 dark:text-white/90 max-[1015px]:size-5" />
        </div>
        {users.map((user, index) => (
          <div
            key={index}
            className="flex cursor-pointer items-center rounded-lg px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span className="text-xs font-medium">{user.initials}</span>
              </div>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
            </div>
            <div className="flex flex-col">
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white/70">
                {user.name}
              </span>
              <span className="ml-3 text-sm text-gray-500 dark:text-white/70">
                {"jksdbfjsbjgb"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryMessage;
