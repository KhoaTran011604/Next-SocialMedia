"use client";
import React, { useReducer, useRef, useState } from "react";
import { Image, Send } from "lucide-react";
import { SendMessage, SendMessageWithImage } from "@/api/socialService";
import { imageProps } from "@/types/MainType";
import { IoMdClose } from "react-icons/io";
import { useChatStore } from "@/zustand/useChatStore";
import { useAuthStore } from "@/zustand/useAuthStore";

const MessageInput = () => {
  const authZustand = useAuthStore();
  const chatStore = useChatStore();
  const { socket } = authZustand;
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const { selectedUser, messages, setMessages } = chatStore;
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<imageProps[]>([]);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleImageUpload = (file: any) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        var dataUpload: imageProps = {
          fileName: file.name,
          imageBase64String: e.target.result,
          imageAbsolutePath: "",
          imageFile: file,
          isNewUpload: true,
        };

        setImages([dataUpload]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImages([]);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async () => {
    if (images.length === 0 && !text.trim()) return;
    if (isBusy) {
      return;
    }
    setIsBusy(true);
    //var data = await sendMessage();
    var request_v2 = null;
    const formData = jsonToFormData({ text: text.trim() });
    if (images.length > 0) {
      formData.append("files", images[0].imageFile);
      request_v2 = formData;
    } else {
      request_v2 = {
        text: text.trim(),
        image: imagePreview,
      };
    }
    if (!selectedUser) {
      return;
    }
    const res =
      images.length == 0
        ? await SendMessage(selectedUser._id, request_v2)
        : await SendMessageWithImage(selectedUser._id, request_v2);
    //dataSocketIO.messages = [...dataSocketIO.messages, res.data];
    if (res.success) {
      const justNow = new Date().toISOString();
      const fakeMessage = {
        _id: Math.random(),
        createdAt: justNow,
        receiverId: selectedUser._id,
        senderId: authZustand.authUser?.id,
        text: text.trim(),
        image: res.data.image,
        updatedAt: justNow,
      };
      setMessages([...messages, fakeMessage]);
      // Clear form
      setText("");
      setImages([]);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setIsBusy(false);
    if (!socket) return;
    socket.emit("stop_typing", { receiverId: "demo_id", senderName: "Khoa" });
  };

  const jsonToFormData = (json: Record<string, any>): FormData => {
    const formData = new FormData();

    Object.entries(json).forEach(([key, value]) => {
      if (value instanceof File) return;

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        // Với string, number, boolean thì append trực tiếp
        formData.append(key, String(value));
      } else {
        // Nếu là object (bao gồm array), stringify
        formData.append(key, JSON.stringify(value));
      }
    });

    return formData;
  };

  const typingRef = useRef(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0); // Chỉ render thủ công khi cần

  React.useEffect(() => {
    if (!socket) return;

    socket.on("typing", (dataTyping) => {
      if (!typingRef.current) {
        typingRef.current = true;
        forceUpdate(); // Chỉ render khi chuyển từ false -> true
      }
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        typingRef.current = false;
        forceUpdate(); // Chỉ render khi chuyển từ true -> false
      }, 2000);
    });

    socket.on("stop_typing", (dataTyping) => {
      typingRef.current = false;
      forceUpdate(); // Render lại khi stop typing
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [socket]);

  return (
    <div className="w-full p-4">
      {/* {typingRef.current && <TypingComponent />} */}
      {images.length > 0 && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={images[0].imageBase64String}
              alt="Preview"
              className="h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-gray-800"
            />
            <button
              onClick={removeImage}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 dark:text-gray-900"
              type="button"
            >
              <IoMdClose />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`btn btn-circle hidden sm:flex ${images.length > 0 ? "text-emerald-500" : "text-zinc-400"} hover:text-primary`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={22} />
        </button>
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="shadow-theme-xs h-11 flex-1 appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              const value = e.target.value;
              setText(value);

              if (!socket || !socket.connected) return;

              // Gửi event typing ngay khi user gõ
              socket.emit("typing", {
                receiverId: selectedUser._id,
                senderName: "Khoa",
              });

              // Reset timeout để ngừng typing sau 1.5s không gõ
              if (typingTimeout.current) clearTimeout(typingTimeout.current);
              typingTimeout.current = setTimeout(() => {
                socket.emit("stop_typing", {
                  receiverId: selectedUser._id, // CHỈNH LẠI Ở ĐÂY
                  senderName: "Khoa",
                });
              }, 1000);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e: any) => handleImageUpload(e.target.files[0])}
          />
        </div>

        {isBusy ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline h-6 w-6 animate-spin fill-primary text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <button
            onClick={handleSendMessage}
            className="btn btn-sm btn-circle cursor-pointer hover:text-primary"
            disabled={!text.trim() && images.length == 0}
          >
            <Send size={22} />
          </button>
        )}
      </div>
    </div>
  );
};
export default MessageInput;
