// hooks/useSocket.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  description: string | null;
}

interface UseSocketProps {
  token: string | null;
  currentUserId: string | undefined;
  serverUrl: string;
}

export function useSocket({ token, currentUserId, serverUrl }: UseSocketProps) {
  const socket = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // 🔌 connect socket
  useEffect(() => {
    if (!token || !currentUserId) {
      toast.warning("❌ Missing token or user ID – not connecting");
      return;
    }

    if (!socket.current) {
      socket.current = io(serverUrl, {
        transports: ["websocket"],
        auth: { token },
      });
    } else {
      socket.current.auth = { token };
      if (!socket.current.connected) socket.current.connect();
    }

    const s = socket.current;

    // --- Listeners ---
    s.on("connect", () => {
      console.log("🟢 Socket connected:", s.id);
      s.emit("getOnlineUsers");
    });

    s.on("connect_error", (err) => {
      toast.error(`Connection failed: ${err.message}`);
    });

    s.on("onlineUsers", (users: User[]) => {
      setOnlineUsers(users.filter((u) => u.id !== currentUserId));
    });

    s.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on("userTyping", (payload) => {
      if (payload.userId !== currentUserId) setIsTyping(true);
    });

    s.on("userStoppedTyping", (payload) => {
      if (payload.userId !== currentUserId) setIsTyping(false);
    });

    s.on("disconnect", () => {
      setOnlineUsers([]);
      setIsTyping(false);
    });

    return () => {
      s.removeAllListeners();
      s.disconnect();
    };
  }, [token, currentUserId, serverUrl]);

  // --- actions ---
  const sendMessage = useCallback(
    (receiverId: string, message: string) => {
      if (!socket.current || !message.trim()) return;

      const payload: Message = {
        senderId: currentUserId!,
        receiverId,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };

      socket.current.emit("sendMessage", payload);
      setMessages((prev) => [...prev, payload]); // optimistic update
    },
    [currentUserId]
  );

  const startTyping = (receiverId: string) => {
    socket.current?.emit("typing", { receiverId });
  };

  const stopTyping = (receiverId: string) => {
    socket.current?.emit("stopTyping", { receiverId });
  };

  return {
    socket,
    onlineUsers,
    messages,
    isTyping,
    sendMessage,
    startTyping,
    stopTyping,
  };
}
