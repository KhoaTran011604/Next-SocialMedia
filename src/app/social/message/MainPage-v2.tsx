"use client";

import { useAuth } from "@/context/auth";
import ChatContainer from "./components/ChatContainer";
import NoChatSelected from "./components/NoChatSelected";
import { useChatStore } from "@/zustand/useChatStore";
import { useIsMobile } from "@/hooks/use-mobile";
import UserOnlineSidebar from "./components/Sidebar";

const MainMessagePage_v2 = () => {
  const { selectedUser } = useChatStore();
  const isMobile = useIsMobile();

  return (
    <div className="relative flex h-[calc(100vh-130px)] max-h-[calc(100vh+300px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {!selectedUser ? (
        <div>
          <div className="block md:hidden">
            <UserOnlineSidebar />
          </div>
          <div className="hidden md:block">
            <NoChatSelected />
          </div>
        </div>
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default MainMessagePage_v2;
