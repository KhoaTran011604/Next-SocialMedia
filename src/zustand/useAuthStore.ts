import { create } from "zustand";
//import { axiosInstance } from "../lib/axios";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { AuthVertify, SignUp } from "@/api/authService";
import { UpdateUser } from "@/api/userService";
import { decryptData } from "@/lib/crypto";
import Cookies from "js-cookie";

// Cấu hình URL server
const BASE_URL = process.env.MODE === "development" ? "http://localhost:5000" : "/";

// Kiểu User cơ bản
interface User {
  _id: string;
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
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  signup: (data: AuthCredentials) => Promise<void>;
  login: (data: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
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
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      var token_info = getTokensFromCookies();
      if (!token_info) {
        //router.replace("/auth/sign-in");
        return;
      }
      const res = await AuthVertify({});
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error: any) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: AuthCredentials) => {
    set({ isSigningUp: true });
    try {
      const res = await SignUp(data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: AuthCredentials) => {
    set({ isLoggingIn: true });
    try {
      const res = await SignUp(data)
      set({ authUser: res.data });
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

  updateProfile: async (data: UpdateProfilePayload) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await UpdateUser("1223", data);
      set({ authUser: res.data });
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

    const socket: Socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket?.disconnect();
    }
  },
}));
