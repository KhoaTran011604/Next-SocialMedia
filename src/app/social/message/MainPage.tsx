"use client";

import ChatHeader from "@/components/Social/Message/ChatHeader";
import MessageByUserItem from "@/components/Social/Message/MessageByUserItem";
import MessageItem from "@/components/Social/Message/MessageItem";
import SendMessComponent from "@/components/Social/Message/SendMessComponent";
import { ChatMessage } from "@/types/MainType";
import { useEffect, useRef, useState } from "react";

const MainMessagePage = () => {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="relative flex h-[calc(100vh-130px)] max-h-[calc(100vh+300px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <ChatHeader
        avatarUrl="https://i.pravatar.cc/150?img=12"
        fullName="Khang"
        isOnline={true}
      />

      <div
        ref={chatContainerRef}
        className="flex-1 space-y-2 overflow-y-auto p-2"
        style={{ maxHeight: "70vh" }}
      >
        {chatHistory.length > 0 ? (
          chatHistory.map((mess, index) => (
            <div key={index}>
              {mess.role === "model" ? (
                <MessageItem data={mess} />
              ) : (
                <MessageByUserItem data={mess} />
              )}
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center dark:text-white">
            No message!
          </div>
        )}
      </div>

      <SendMessComponent
        setIsBusy={setIsBusy}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        setResponse={setResponse}
      />
    </div>
  );
};

export default MainMessagePage;
