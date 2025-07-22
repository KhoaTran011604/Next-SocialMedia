import React from "react";
import { CiSquareMore } from "react-icons/ci";

const MessageByUserItem = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className={`flex w-full justify-end`}>
      <div className="max-[200px] flex items-start gap-2.5">
        <img
          className="h-8 w-8 rounded-full"
          src="/images/user/user-05.jpg"
          alt="Jese image"
        />
        <div className="leading-1.5 flex w-full max-w-[320px] flex-col rounded-e-xl rounded-es-xl border-gray-200 bg-gray-100 p-4 dark:bg-gray-700">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {data?.sendBy || "Khoa"}
            </span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {data?.createdAt || "12:00"}
            </span>
          </div>
          <p className="whitespace-normal break-words py-2.5 text-sm font-normal text-gray-900 dark:text-white">
            {data?.text}
          </p>
        </div>
        <div className="relative inline-block">
          <button
            className="dropdown-toggle my-2"
            onClick={() => {
              toggleDropdown();
            }}
          >
            <CiSquareMore className="size-6 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageByUserItem;
