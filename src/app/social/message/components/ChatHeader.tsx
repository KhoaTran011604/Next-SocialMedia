import LottieComponent from "@/components/lotties/lottie";
import { useAuth } from "@/context/auth";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useChatStore } from "@/zustand/useChatStore";
import { X } from "lucide-react";
import React, { useEffect, useReducer, useRef } from "react";
import TypingComponent from "./lotties/TypingComponent";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const dataAuthStore = useAuthStore();
  const { socket } = dataAuthStore;
  const { onlineUsers } = dataAuthStore;

  const typingRef = useRef(false);

  // useReducer chỉ để ép render nhẹ khi state thay đổi thực sự
  const [, forceRender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!socket) return;

    socket.on("typing", () => {
      if (!typingRef.current) {
        typingRef.current = true;
        forceRender(); // render 1 lần khi bắt đầu gõ
      }
    });

    socket.on("stop_typing", () => {
      if (typingRef.current) {
        typingRef.current = false;
        forceRender(); // render 1 lần khi dừng gõ
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [socket]);

  return (
    <div className="border-base-300 border-b p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar relative">
            <div className="relative size-10 overflow-hidden rounded-full">
              <img
                src={
                  selectedUser && selectedUser.images.length > 0
                    ? selectedUser.images[0].imageAbsolutePath
                    : "/images/user/default-user.png"
                }
                alt={selectedUser?.fullName}
              />
            </div>
            {typingRef.current && (
              <div className="absolute -bottom-[15px] -right-[10px]">
                <TypingComponent width={20} />
              </div>
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>

            <p className="text-base-content/70 text-sm">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
