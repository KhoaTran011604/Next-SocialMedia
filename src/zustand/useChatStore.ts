import { create } from "zustand";

import { useAuthStore } from "./useAuthStore";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { GetMessages, getUsersForSidebar, SendMessage, SendMessageWithImage } from "@/api/socialService";

// ======= Interface định nghĩa =======

// Kiểu User đơn giản (bạn có thể mở rộng thêm)
export interface User {
  _id: string;
  fullName: string;
  profilePic?: string;
  email?: string;
}

// Kiểu Message
export interface Message {
  // _id: string;
  // senderId: string;
  // senderName: string;
  // receiverId: string;
  // content: string;
  // createdAt: string;
  _id: number;
  createdAt: string;
  receiverId: string;
  senderId: any;
  text: string;
  image: any;
  updatedAt: string;
  // Có thể thêm updatedAt, isRead,...
}

// Kiểu dữ liệu gửi tin nhắn
export interface MessageInput {
  content: string;
  images?: string[]; // nếu có ảnh
  // thêm trường khác nếu có: video, audio, etc.
}

// Store type
interface ChatState {
  messages: Message[];
  users: User[];
  selectedUser: any | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setMessages: (newMessList: Message[]) => void
  sendMessage: (messageData: MessageInput) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  followNotifyToMe: () => void;
  unFollowNotifyToMe: () => void;
  setSelectedUser: (user: any) => void;
}

// ========== Zustand store ==========
export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await getUsersForSidebar({});
      set({ users: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {

      const res = await GetMessages(userId);


      set({ messages: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setMessages: (newMessList: Message[]) => {
    set({ messages: newMessList })
  },

  sendMessage: async (messageData: MessageInput) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    try {
      const res = await SendMessage(selectedUser._id, {
        ...messageData,
      });
      // const res = await SendMessageWithImage(selectedUser._id, {
      //   ...messageData,
      // });
      set({ messages: [...messages, res.data] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Send message failed");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    // Nhận sự kiện typing
    socket.on("typing", (dataReturn) => {
      console.log("typing", dataReturn);

    });

    socket.on("stop_typing", (dataReturn) => {
      console.log("stop_typing", dataReturn);
    });

    socket.on("newMessage", (newMessage: Message) => {
      const isFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isFromSelectedUser) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },
  unsubscribeFromMessages: () => {
    const socket: Socket | null = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("typing");
    socket.off("stop_typing");
  },
  followNotifyToMe: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const condition = !selectedUser || (selectedUser._id != newMessage.senderId)
      if (condition) {
        toast.info(`📩 Tin nhắn mới từ ${newMessage?.senderName || "ai đó"}`, {
          position: "bottom-right"
        })

      }






    });
  },
  unFollowNotifyToMe: () => {
    const socket: Socket | null = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
  },

  setSelectedUser: (user: User) => set({ selectedUser: user }),
}));
