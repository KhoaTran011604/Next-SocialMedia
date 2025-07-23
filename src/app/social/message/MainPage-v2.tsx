"use client";

import { useAuth } from "@/context/auth";
import ChatContainer from "./components/ChatContainer";
import NoChatSelected from "./components/NoChatSelected";

const MainMessagePage_v2 = () => {
  const auth = useAuth();
  const { selectedUser } = auth;
  return (
    <div className="relative flex h-[calc(100vh-130px)] max-h-[calc(100vh+300px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
    </div>
  );
};

export default MainMessagePage_v2;
