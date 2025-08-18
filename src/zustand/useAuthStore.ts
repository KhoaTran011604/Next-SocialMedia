import { create } from "zustand";
//import { axiosInstance } from "../lib/axios";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { AuthVertify, SignUp } from "@/api/authService";
import { UpdateUser } from "@/api/userService";
import { decryptData } from "@/lib/crypto";
import Cookies from "js-cookie";
import { useChatStore } from "./useChatStore";


// Cấu hình URL server
const LOCAL_SOCKET_URL = "http://localhost:5000";
const PUBLIC_SOCKET_URL = "https://server-next-socialmedia.onrender.com";

// Kiểu User cơ bản
interface User {
  id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  // Thêm các trường khác nếu cần
}

// Kiểu dữ liệu đăng ký / đăng nhập
interface AuthCredentials {
  email: string;
  password: string;
  fullName?: string; // optional cho login
}

// Kiểu update profile (bạn có thể chi tiết hơn)
interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  profilePic?: string;
  password?: string;
}

// Kiểu store
interface AuthState {
  authUser: User | null;
  selectedUser: any;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: (dataAuthUser: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  setSelectedUser: (user: User) => void;
}
const getTokensFromCookies = () => {
  const encryptedToken = Cookies.get("token_info");
  if (encryptedToken) {
    try {
      const token_info = decryptData(encryptedToken); // Giải mã token

      if (token_info) {
        return token_info;
      }
    } catch (err) {
      console.error("Lỗi giải mã token từ cookie:", err);
    }
  }
  return null;
};
// Store Zustand
export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  selectedUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async (dataAuthUser: any) => {
    try {
      // var token_info = getTokensFromCookies();
      // if (!token_info) {
      //   //router.replace("/auth/sign-in");
      //   return;
      // }
      // const res = await AuthVertify({});
      set({ authUser: dataAuthUser });
      get().connectSocket();
    } catch (error: any) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (dataAuthUser: any) => {
    set({ isSigningUp: true });
    try {

      set({ authUser: dataAuthUser });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (dataAuthUser: any) => {
    set({ isLoggingIn: true });
    try {

      set({ authUser: dataAuthUser });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      //await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (dataAuthUser: any) => {
    set({ isUpdatingProfile: true });
    try {

      set({ authUser: dataAuthUser });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();


    if (!authUser || get().socket?.connected) return;

    const socket: Socket = io(LOCAL_SOCKET_URL, {
      query: {
        userId: authUser.id,
      },
    });
    const socketAll: Socket = io(LOCAL_SOCKET_URL);

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {


      set({ onlineUsers: userIds });
    });

    socketAll.on("newMessage", (newMessage) => {



      const isToMe = newMessage.receiverId === authUser.id && newMessage.senderId !== get().selectedUser?.id
      if (isToMe) {
        toast.info(`📩 Tin nhắn mới từ ${newMessage.senderName || "ai đó"}`, {
          position: "bottom-right"
        })
      }
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket?.disconnect();
    }
  },
  setSelectedUser: (user: User) => set({ selectedUser: user }),
}));
