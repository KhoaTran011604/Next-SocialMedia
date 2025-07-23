import { formatMessageTime } from "@/lib/utils";
import React from "react";
import { CiSquareMore } from "react-icons/ci";
const MessageItem = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    // Chỉ set message một lần khi component được render lần đầu
    setMessage(data?.text);
  }, []);
  return (
    <div className={`flex w-full justify-start`}>
      <div className="max-[200px] flex items-start gap-2.5">
        <div className="leading-1.5 flex w-full max-w-[320px] flex-col rounded-e-xl rounded-es-xl border-gray-200 bg-gray-100 p-4 dark:bg-gray-700">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {data?.authUser?.fullName || "BOT"}
            </span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {formatMessageTime(data?.createdAt) || "12:00"}
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

export default MessageItem;
