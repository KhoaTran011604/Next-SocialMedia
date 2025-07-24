import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";

import { useAuth } from "@/context/auth";
import { toast } from "react-toastify";
import { SendMessage } from "@/api/socialService";

const MessageInput = () => {
  const auth = useAuth();
  const { dataSocketIO, selectedUser, messages, setMessages } = auth;
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   if (!file.type.startsWith("image/")) {
  //     toast.error("Please select an image file");
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setImagePreview(reader.result as string); // result là string | ArrayBuffer
  //   };
  //   reader.readAsDataURL(file);
  // };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  console.log(auth);

  const handleSendMessage = async () => {
    if (!text.trim() && !imagePreview) return;

    //var data = await sendMessage();

    const res = await SendMessage(selectedUser._id, {
      text: text.trim(),
      image: imagePreview,
    });
    dataSocketIO.messages = [...dataSocketIO.messages, res.data];
    const justNow = new Date().toISOString();
    const fakeMessage = {
      _id: Math.random(),
      createdAt: justNow,
      receiverId: selectedUser._id,
      senderId: auth.user.id,
      text: text.trim(),
      image: imagePreview,
      updatedAt: justNow,
    };
    setMessages([...messages, fakeMessage]);
    // Clear form
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full p-4">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-20 rounded-lg border border-zinc-700 object-cover"
            />
            <button
              onClick={removeImage}
              className="bg-base-300 absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="shadow-theme-xs h-11 flex-1 appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                console.log("Enter");

                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          {/* <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          /> */}
        </div>
        {/* <button
          type="button"
          className={`btn btn-circle hidden sm:flex ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} />
        </button> */}
        <button
          onClick={handleSendMessage}
          className="btn btn-sm btn-circle cursor-pointer hover:text-primary"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
};
export default MessageInput;
