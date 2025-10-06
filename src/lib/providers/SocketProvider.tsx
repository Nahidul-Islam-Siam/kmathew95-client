/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, type Socket } from "socket.io-client";

// 🔧 Environment variable for flexibility
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://10.0.20.98:6565";

type MessagePayload = {
  receiverId: string;
  message?: string;
  images?: string[]; // array of URLs
};

type TypingPayload = {
  receiverId: string;
};

// 👇 Payloads received from server
type ReceivedMessage = {
  senderId: string;
  message?: string;
  images?: string[];
  timestamp: string;
};

type UserTypingEvent = { senderId: string };
type UserStoppedTypingEvent = { senderId: string };
type OnlineUsersEvent = string[]; // or array of user objects

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  isAuthenticated: boolean;

  // 🔐 Auth
  connect: () => void;
  disconnect: () => void;
  authenticate: (token: string) => Promise<boolean>;

  // 💬 Messaging
  sendMessage: (payload: MessagePayload) => void;
  startTyping: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
  getOnlineUsers: () => void;

  // 📡 Listeners - Register callbacks
  onMessage: (callback: (data: ReceivedMessage) => void) => void;
  onUserTyping: (callback: (data: UserTypingEvent) => void) => void;
  onUserStoppedTyping: (callback: (data: UserStoppedTypingEvent) => void) => void;
  onOnlineUsers: (callback: (users: OnlineUsersEvent) => void) => void;
  onError: (callback: (err: { message: string }) => void) => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isAuthenticated: false,
  connect: () => {},
  disconnect: () => {},
  authenticate: async () => false,
  sendMessage: () => {},
  startTyping: () => {},
  stopTyping: () => {},
  getOnlineUsers: () => {},
  onMessage: () => {},
  onUserTyping: () => {},
  onUserStoppedTyping: () => {},
  onOnlineUsers: () => {},
  onError: () => {},
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // -----------------------------
  // 🔌 Connection Management
  // -----------------------------

  const connect = () => {
    if (socket?.connected) return;

    // Cleanup any existing socket
    if (socket) {
      socket.disconnect();
      socket.close();
    }

    const newSocket = io(SOCKET_SERVER_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("🟢 Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Connect error:", err);
      setIsConnected(false);
    });

    newSocket.connect();
    setSocket(newSocket);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket.close();
      setSocket(null);
      setIsConnected(false);
      setIsAuthenticated(false);
      console.log("Socket manually disconnected");
    }
  };

  // -----------------------------
  // 🔐 Authentication
  // -----------------------------

  const authenticate = async (token: string): Promise<boolean> => {
    if (!socket || !isConnected) return false;

    return new Promise((resolve) => {
      // ✅ Matches your spec: "authenticate" event
      socket.emit("authenticate", { token });

      const onSuccess = (user: unknown) => {
        console.log("✅ Authenticated:", user);
        setIsAuthenticated(true);
        cleanUp();
        resolve(true);
      };

      const onFailure = (err: { message: string } | string) => {
        const errorMsg = typeof err === "string" ? err : err.message;
        console.error("❌ Auth failed:", errorMsg);
        setIsAuthenticated(false);
        cleanUp();
        resolve(false);
      };

      const cleanUp = () => {
        socket.off("authenticated", onSuccess);
        socket.off("unauthorized", onFailure);
        socket.off("error", onFailure);
      };

      socket.once("authenticated", onSuccess);
      socket.once("unauthorized", onFailure);
      socket.once("error", onFailure);
    });
  };

  // -----------------------------
  // 💬 Messaging & Typing
  // -----------------------------

  const sendMessage = (payload: MessagePayload) => {
    if (!socket || !isAuthenticated) return;
    socket.emit("sendMessage", payload);
  };

  const startTyping = (receiverId: string) => {
    if (!socket || !isAuthenticated) return;
    socket.emit("typing", { receiverId });
  };

  const stopTyping = (receiverId: string) => {
    if (!socket || !isAuthenticated) return;
    socket.emit("stopTyping", { receiverId });
  };

  const getOnlineUsers = () => {
    if (!socket || !isAuthenticated) return;
    socket.emit("getOnlineUsers");
  };

  // -----------------------------
  // 🔊 Event Listeners (Server → Client)
  // -----------------------------

  // These allow components to subscribe to real-time events
  const onMessage = (callback: (data: ReceivedMessage) => void) => {
    if (!socket) return;
    socket.on("message", callback);
  };

  const onUserTyping = (callback: (data: UserTypingEvent) => void) => {
    if (!socket) return;
    socket.on("userTyping", callback);
  };

  const onUserStoppedTyping = (callback: (data: UserStoppedTypingEvent) => void) => {
    if (!socket) return;
    socket.on("userStoppedTyping", callback);
  };

  const onOnlineUsers = (callback: (users: OnlineUsersEvent) => void) => {
    if (!socket) return;
    socket.on("onlineUsers", callback);
  };

  const onError = (callback: (err: { message: string }) => void) => {
    if (!socket) return;
    socket.on("error", callback);
  };

  // -----------------------------
  // 🧠 Cleanup on Unmount
  // -----------------------------

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        isAuthenticated,
        connect,
        disconnect,
        authenticate,
        sendMessage,
        startTyping,
        stopTyping,
        getOnlineUsers,
        onMessage,
        onUserTyping,
        onUserStoppedTyping,
        onOnlineUsers,
        onError,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

// ✅ Hook for easy usage
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};