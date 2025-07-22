import React from "react";
import { IoIosCall, IoIosVideocam } from "react-icons/io";
type ChatHeaderProps = {
  avatarUrl: string;
  fullName: string;
  isOnline?: boolean;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({
  avatarUrl,
  fullName,
  isOnline = true,
}) => {
  return (
    <div className="flex items-center justify-between border-b bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-transparent">
      {/* Left: Avatar + Name */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={avatarUrl}
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold">{fullName}</p>
          <p className="text-xs text-gray-500">
            {isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right: Call & Video */}
      <div className="flex items-center space-x-2">
        <button
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          title="Voice call"
        >
          <IoIosCall />
        </button>
        <button
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          title="Video call"
        >
          <IoIosVideocam />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
