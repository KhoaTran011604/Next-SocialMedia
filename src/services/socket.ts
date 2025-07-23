// socket.ts
import { io, Socket } from "socket.io-client";

// 👇 Tuỳ chọn: define type sự kiện gửi/nhận
interface ServerToClientEvents {
    userList: (users: any[]) => void;
    userJoined: (username: string) => void;
    newMessage: (msg: any) => void;
    messageHistory: (messages: any[]) => void;
    userLeft: (username: string) => void;
}

interface ClientToServerEvents {
    join: (username: string) => void;
    sendMessage: (message: string) => void;
    userLeft: (message: string) => void;
}


// 👇 socket đã gán type rõ ràng
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.LOCAL_SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});
