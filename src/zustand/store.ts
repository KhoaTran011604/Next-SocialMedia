

import { Filter, Task } from '@/types/MainType';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';


const BASE_URL =
  "http://localhost:5000"

// ---------------- Types ----------------
interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  // thêm các field khác nếu cần
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

interface UpdateProfilePayload {
  fullName?: string;
  // thêm các field cập nhật khác
}

interface StoreState {
  tasks: Task[];
  task: Task;
  open: boolean;
  openAlert: boolean;
  error: boolean;
  filterPage: Filter;
  isLoading: boolean;
  totalRecords: number;
  hasDataChanged: boolean;
  setTasks: (data: Task[]) => void;
  setTask: (data: Task) => void;
  setOpen: (status: boolean) => void;
  setOpenAlert: (status: boolean) => void;
  setError: (status: boolean) => void;
  setIsLoading: (status: boolean) => void;
  setTotalRecords: (number: number) => void;
  setHasDataChanged: (status: boolean) => void;

  //#region SocketIO
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  // checkAuth: () => Promise<void>;
  // signup: (data: SignupPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  // logout: () => Promise<void>;
  // updateProfile: (data: UpdateProfilePayload) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  //#endregion
}
const filterInit = {
  keySearch: '',
  sort: {},
  page: 1,
  pageSize: 100,
  sessionCode: Math.random().toString(),
};

const useStore = create<StoreState>((set, get) => ({
  tasks: [],
  task: { _id: '', title: '', completed: false },
  open: false,
  openAlert: false,
  error: false,
  filterPage: filterInit,
  isLoading: false,
  totalRecords: 0,
  hasDataChanged: false,
  setTasks: (data: Task[]) => {
    set({ tasks: data });
  },
  setTask: (data: Task) => {
    set({ task: data });
  },
  setOpen: (status: boolean) => {
    set({ open: status });
  },
  setOpenAlert: (status: boolean) => {
    set({ openAlert: status });
  },
  setError: (status: boolean) => {
    set({ error: status });
  },
  setIsLoading: (status: boolean) => {
    set({ isLoading: status });
  },
  setTotalRecords: (total: number) => {
    set({ totalRecords: total });
  },
  setHasDataChanged: (status: boolean) => {
    set({ hasDataChanged: status });
  },

  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // checkAuth: async () => {
  //   try {
  //     const res = await axiosInstance.get("/auth/check");

  //     set({ authUser: res.data });
  //     get().connectSocket();
  //   } catch (error) {
  //     console.log("Error in checkAuth:", error);
  //     set({ authUser: null });
  //   } finally {
  //     set({ isCheckingAuth: false });
  //   }
  // },

  // signup: async (data) => {
  //   set({ isSigningUp: true });
  //   try {
  //     const res = await axiosInstance.post("/auth/signup", data);
  //     set({ authUser: res.data });
  //     toast.success("Account created successfully");
  //     get().connectSocket();
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isSigningUp: false });
  //   }
  // },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      //toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      //toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }

    const res = await apiLogin(data);

    if (res.success) {
      const dataToken = getDataFromToken(res.data.accessToken);

      if (dataToken) {
        setUser(dataToken);
      }
      const { accessToken, refreshToken } = res.data;
      const encrypted = encryptData({
        accessToken,
        refreshToken,
      });
      Cookies.set("token_info", encrypted, { expires: 7 }); // lưu 7 ngày
      setIsAuthenticated(true);
      router.push("/social");
      return { success: true, data: dataToken };
    } else {
      return { success: false, data: {} };
    }
  },

  // logout: async () => {
  //   try {
  //     await axiosInstance.post("/auth/logout");
  //     set({ authUser: null });
  //     toast.success("Logged out successfully");
  //     get().disconnectSocket();
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // },

  // updateProfile: async (data) => {
  //   set({ isUpdatingProfile: true });
  //   try {
  //     const res = await axiosInstance.put("/auth/update-profile", data);
  //     set({ authUser: res.data });
  //     toast.success("Profile updated successfully");
  //   } catch (error) {
  //     console.log("error in update profile:", error);
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isUpdatingProfile: false });
  //   }
  // },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

}));

export default useStore;
