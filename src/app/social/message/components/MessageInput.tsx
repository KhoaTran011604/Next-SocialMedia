"use client";
import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";

import { useAuth } from "@/context/auth";
import { SendMessage, SendMessageWithImage } from "@/api/socialService";
import { imageProps } from "@/types/MainType";
import { IoMdClose } from "react-icons/io";

const MessageInput = () => {
  const auth = useAuth();
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const { dataSocketIO, selectedUser, messages, setMessages } = auth;
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<imageProps[]>([]);
  //const [showEmoji, setShowEmoji] = useState(false);

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

    const res =
      images.length == 0
        ? await SendMessage(selectedUser._id, request_v2)
        : await SendMessageWithImage(selectedUser._id, request_v2);
    dataSocketIO.messages = [...dataSocketIO.messages, res.data];
    if (res.success) {
      const justNow = new Date().toISOString();
      const fakeMessage = {
        _id: Math.random(),
        createdAt: justNow,
        receiverId: selectedUser._id,
        senderId: auth.user.id,
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

  // const addEmoji = (e: { unified: string }) => {
  //   const sym = e.unified.split("_");
  //   const codeArray = sym.map((el) => parseInt(el, 16));
  //   const emoji = String.fromCodePoint(...codeArray);
  //   setText((prev) => prev + emoji);
  // };

  return (
    <div className="w-full p-4">
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
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="shadow-theme-xs h-11 flex-1 appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
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
        <button
          type="button"
          className={`btn btn-circle hidden sm:flex ${images.length > 0 ? "text-emerald-500" : "text-zinc-400"} hover:text-primary`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} />
        </button>

        <button
          onClick={handleSendMessage}
          className="btn btn-sm btn-circle cursor-pointer hover:text-primary"
          disabled={!text.trim() && images.length == 0}
        >
          <Send size={22} />
        </button>
        {/* <span
          onClick={() => setShowEmoji(!showEmoji)}
          className="cursor-pointer hover:text-primary"
        >
          <BsEmojiSunglasses />
        </span>
        {showEmoji && (
          <div className="absolute bottom-4 right-4">
            <button
              className="absolute bottom-0 left-0 -translate-x-10 -translate-y-4 rounded-full bg-gray-200 p-2 shadow-lg hover:scale-110 hover:text-primary"
              onClick={() => setShowEmoji(false)}
            >
              <IoMdClose />
            </button>
            <Picker
              data={data}
              emojiSize={20}
              emojiButtonSize={28}
              onEmojiSelect={addEmoji}
              maxFrequentRows={0}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};
export default MessageInput;
