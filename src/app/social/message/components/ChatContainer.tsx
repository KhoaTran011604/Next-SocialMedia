import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

import { formatMessageTime } from "../../../../lib/utils";
import { AuthProvider, useAuth } from "../../../../context/auth";
import { GetMessages } from "@/api/socialService";
import MessageByUserItem from "@/components/Social/Message/MessageByUserItem";
import MessageItem from "@/components/Social/Message/MessageItem";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useChatStore } from "@/zustand/useChatStore";
import { log } from "console";
import UserOnlineSidebar from "./Sidebar";

const ChatContainer = () => {
  const dataChatStore = useChatStore();
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    followNotifyToMe,
    unFollowNotifyToMe,
  } = dataChatStore;
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }

    subscribeToMessages();
    followNotifyToMe();

    return () => {
      unsubscribeFromMessages();
      unFollowNotifyToMe();
    };
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    followNotifyToMe,
    unFollowNotifyToMe,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages?.length) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages?.length > 0 &&
          messages.map((message: any) => (
            <div
              key={Math.random()}
              className={`chat ${message.senderId === authUser?.id ? "self-end" : "self-start"}`}
              ref={messageEndRef}
            >
              {message.senderId === authUser?.id ? (
                <MessageByUserItem data={{ ...message, authUser: authUser }} />
              ) : (
                <MessageItem data={{ ...message, authUser: selectedUser }} />
              )}
            </div>
          ))}
      </div>
      <MessageInput />
    </div>
  );
};
export default ChatContainer;
