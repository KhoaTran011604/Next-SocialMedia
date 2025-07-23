import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

import { formatMessageTime } from "../../../../lib/utils";
import { AuthProvider, useAuth } from "../../../../context/auth";
import { GetMessages } from "@/api/socialService";
import MessageByUserItem from "@/components/Social/Message/MessageByUserItem";
import MessageItem from "@/components/Social/Message/MessageItem";

const ChatContainer = () => {
  const auth = useAuth();
  const { dataSocketIO } = auth;
  const {
    authUser,

    getMessages,
    isMessagesLoading,
    //selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = auth.dataSocketIO;

  const { selectedUser, messages } = auth;
  console.log("messages.number", messages);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      var fakeMessages = [...messages];
      subscribeToMessages(selectedUser, fakeMessages);
    }

    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
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
              key={message._id}
              className={`chat ${message.senderId === authUser?.id ? "self-end" : "self-start"}`}
              ref={messageEndRef}
            >
              {message.senderId === authUser?.id ? (
                <MessageByUserItem data={{ ...message, authUser: authUser }} />
              ) : (
                <MessageItem data={{ ...message, authUser: selectedUser }} />
              )}
              {/* <div className="bg-red-500">
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser?.id
                          ? authUser?.profilePic || "/images/user/default-user.png"
                          : selectedUser?.profilePic ||
                            "/images/user/default-user.png"
                      }
                      alt="profile pic"
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="ml-1 text-xs opacity-50">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="mb-2 rounded-md sm:max-w-[200px]"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div> */}
            </div>
          ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
