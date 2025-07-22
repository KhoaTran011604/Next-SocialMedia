import { HD_Button } from "@/components/common/HD_Button";
import { ChatMessage } from "@/types/MainType";
import React, { useState, KeyboardEvent, ChangeEvent } from "react";

// Props cho component
interface SendMessComponentProps {
  setIsBusy: (value: boolean) => void;
  chatHistory: ChatMessage[];
  setChatHistory: (data: ChatMessage[]) => void;
  setResponse: (data: string) => void;
}

const SendMessComponent: React.FC<SendMessComponentProps> = ({
  setIsBusy,
  chatHistory,
  setChatHistory,
  setResponse,
}) => {
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = async () => {
    // if (!message.trim()) return;
    // const userMessage: ChatMessage = { role: "user", content: message };
    // setChatHistory([...chatHistory, userMessage]);
    // setIsBusy(true);
    // setMessage("");
    // // Fake response
    // setTimeout(() => {
    //   const modelResponse: ChatMessage = {
    //     role: "model",
    //     content: "This is a mock response.",
    //   };
    //   setChatHistory((prev: ChatMessage[]) => [...prev, modelResponse]);
    //   setResponse(modelResponse.text);
    //   setIsBusy(false);
    // }, 1000);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <div className="sticky bottom-0 flex items-center gap-2 border-t border-gray-200 p-2 dark:border-gray-800">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="shadow-theme-xs h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
      />

      <button onClick={handleSendMessage} className="px-4 py-2 text-sm">
        Send
      </button>
    </div>
  );
};

export default SendMessComponent;
