import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";

import { apiLogin, AuthVertify, RefreshToken, SignUp } from "@/api/authService";
import { getDataFromToken } from "@/hooks/useLocalStore";
import { decryptData, encryptData } from "@/lib/crypto";
import { io, Socket } from "socket.io-client";
import {
  GetMessages,
  getUsersForSidebar,
  SendMessage,
} from "@/api/socialService";
import { UserTokenPayload } from "@/types/MainType";
import { BaseResponse } from "@/api/BaseResponse";

type AuthPayload = {
  email: string;
  password: string;
};
type SignUpPayload = {
  fullName: string;
  email: string;
  password: string;
};
type LoginResponse = {
  success: boolean;
  data: any;
  message?: string;
};

interface UpdateProfilePayload {
  fullName?: string;
  // thêm các field cập nhật khác
}

interface AuthUser {
  id: string;
  fullName?: string;
  email?: string;
  image?: string;
  // thêm các field khác nếu cần
}

interface DataSocketIOProps {
  //#region SocketIO
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;
  messages: any;
  users: any;
  selectedUser: any;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: SignUpPayload) => Promise<void>;
  login: (data: SignUpPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  getUsers: () => void;
  getMessages: (userId: string) => Promise<void>;
  //sendMessage: (messageData: any) => Promise<BaseResponse<any>>;
  subscribeToMessages: (selectedUser: any, oldMessage: any) => void;
  unsubscribeFromMessages: () => void;
  //setSelectedUser: (selectedUser: any) => void;
  //#endregion
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: any;
  login: (data: AuthPayload) => Promise<LoginResponse>;
  register: (data: SignUpPayload) => Promise<boolean>;
  logout: () => boolean;
  dataSocketIO: DataSocketIOProps;
  selectedUser: any;
  setSelectedUser: (selectedUser: any) => void;
  messages: any;
  setMessages: (data: any) => void;
};
const initialState: DataSocketIOProps = {
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  checkAuth: async () => {},
  signup: async (_data: SignUpPayload) => {},
  login: async (_data: SignUpPayload) => {},
  logout: async () => {},
  updateProfile: async (_data: UpdateProfilePayload) => {},
  connectSocket: () => {},
  disconnectSocket: () => {},
  getUsers: () => {},
  getMessages: async () => {},
  // sendMessage: async (messageData) => {
  //   return "";
  // },
  subscribeToMessages: (selectedUser: any, oldMessage: any) => {},
  unsubscribeFromMessages: () => {},
  //setSelectedUser: (selectedUser) => {},
};
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: {},
  login: async (data) => ({ success: false, data: {} }),
  register: async (data) => false,
  logout: () => true,
  dataSocketIO: initialState,
  selectedUser: null,
  setSelectedUser: () => {},
  messages: [],
  setMessages: (data) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserTokenPayload | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<any | null>([]);
  const [dataSocketIO, setDataSocketIO] = useState<DataSocketIOProps>({
    ...initialState,
    connectSocket: () => connectSocket(),
    disconnectSocket: () => disconnectSocket(),
    getUsers: () => getUsers(),
    getMessages: async (userId) => getMessages(userId),
    //sendMessage: (data) => sendMessage(data),
    subscribeToMessages: (selectedUserId, oldMessage) =>
      subscribeToMessages(selectedUserId, oldMessage),
    unsubscribeFromMessages: () => unsubscribeFromMessages(),
    //setSelectedUser: (data) => setSelectedUser(data),
  });

  const login = async (data: AuthPayload) => {
    const res = await apiLogin(data);

    if (res.success) {
      const dataToken = getDataFromToken(res.data.accessToken);

      if (dataToken) {
        setUser(dataToken);
        //Socket IO

        var newAuthUser = {
          id: dataToken.id,
          fullName: dataToken.fullName,
          email: dataToken.email,
          image: "",
        };
        dataSocketIO.authUser = newAuthUser;
        dataSocketIO.isLoggingIn = true;
        dataSocketIO.connectSocket();
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
      dataSocketIO.isLoggingIn = false;
      return { success: false, data: {}, message: res.message };
    }
  };
  const register = async (data: SignUpPayload) => {
    const res = await SignUp(data);
    return res.success ? true : false;
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    dataSocketIO.authUser = null;
    dataSocketIO.disconnectSocket();
    return true;
  };
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
  const vertifyToken = async () => {
    var token_info = getTokensFromCookies();
    if (!token_info) {
      router.replace("/auth/sign-in");
      return;
    }
    const response = await AuthVertify({});

    if (response.success) {
      setIsAuthenticated(true);

      setUser(response.data);
      //SocketIO
      dataSocketIO.authUser = response.data;
      dataSocketIO.connectSocket();
      //router.push("/admin");
    } else if (!response.success && response.message === "TokenExpiredError") {
      //1.Call API to refresh token

      const refreshToken = token_info.refreshToken;

      const res = await RefreshToken({ refreshToken });

      //2.Receive new accessToken and vertify
      if (res.success) {
        //+Vertify true -> pass
        //localStorage.setItem('@accessToken', res.data.accessToken);
        const dataFromToken = getDataFromToken(res.data.accessToken);
        if (dataFromToken) {
          setUser(dataFromToken);
          //SocketIO
          var newAuthUser = {
            id: dataFromToken.userId,
            fullName: "Demo",
            email: "demo@gmail.com",
            image: "",
          };
          dataSocketIO.authUser = newAuthUser;
          dataSocketIO.connectSocket();
        }

        const encrypted = encryptData({
          accessToken: res.data.accessToken,
          refreshToken,
        });
        Cookies.set("token_info", encrypted, { expires: 7 }); // lưu 7 ngày

        vertifyToken();
      } else {
        //+Vertify false -> router push to login
        router.replace("/auth/sign-in");
      }
    } else {
      router.replace("/auth/sign-in");
    }
  };

  const LOCAL_SOCKET_URL = "http://localhost:5000";
  const PUBLIC_SOCKET_URL = "https://server-next-socialmedia.onrender.com";
  //#region SocketIO

  const connectSocket = () => {
    const { authUser } = dataSocketIO;

    if (!authUser || dataSocketIO.socket?.connected) return;

    const socket = io(PUBLIC_SOCKET_URL, {
      query: {
        userId: authUser.id,
      },
    });
    socket.connect();

    dataSocketIO.socket = socket;

    dataSocketIO.socket.on("getOnlineUsers", (userIds) => {
      dataSocketIO.onlineUsers = userIds;
    });
  };
  const disconnectSocket = () => {
    if (dataSocketIO.socket?.connected) dataSocketIO.socket.disconnect();
  };

  const getUsers = async () => {
    dataSocketIO.isUsersLoading = true;

    try {
      const res = await getUsersForSidebar({});
      //Call API
      dataSocketIO.users = res.data;
    } catch (error) {
      console.log(error);
    } finally {
      dataSocketIO.isUsersLoading = false;
    }
  };

  const getMessages = async (userId: string) => {
    dataSocketIO.isUsersLoading = true;

    try {
      if (userId.length > 0) {
        const res = await GetMessages(userId);

        dataSocketIO.messages = res.data;
        setMessages(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dataSocketIO.isUsersLoading = false;
    }
  };
  const sendMessage = async (messageData: any) => {
    try {
      const res = await SendMessage(selectedUser.id, {
        ...messageData,
      });
      //dataSocketIO.messages = [...dataSocketIO.messages, res.data];
      setMessages([...messages, res.data]);
    } catch (error) {
      //toast.error(error.response.data.message);
    }
  };
  const subscribeToMessages = (fakeSelectedUser: any, oldMessage: any) => {
    if (!fakeSelectedUser) return;

    const socket = dataSocketIO.socket;
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser =
          newMessage.senderId === fakeSelectedUser._id;

        if (!isMessageSentFromSelectedUser) return;
        setMessages([...dataSocketIO.messages, newMessage]);
        dataSocketIO.messages = [...dataSocketIO.messages, newMessage];
        //setMessages([...messages, newMessage]);
      });
    }
  };

  const unsubscribeFromMessages = () => {
    const socket = dataSocketIO.socket;
    if (socket) socket.off("newMessage");
  };

  //#endregion

  useEffect(() => {
    vertifyToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        dataSocketIO,
        selectedUser,
        setSelectedUser,
        messages,
        setMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
export const useAuth = () => useContext(AuthContext);
