// // app/socket-provider.tsx
// "use client";

// import {
//   type ReactNode,
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { io, Socket } from "socket.io-client";

// // === 🔹 Define All Types First ===

// /**
//  * Payloads sent from client → server
//  */
// interface SendMessagePayload {
//   receiverId: string;
//   message: string;
//   images?: string[];
// }

// interface TypingPayload {
//   receiverId: string;
// }

// /**
//  * Events emitted by client
//  */
// type ClientToServerEvents = {
//   authenticate: ( { token: string }) => void;
//   sendMessage: ( SendMessagePayload) => void;
//   typing: ( TypingPayload) => void;
//   stopTyping: ( TypingPayload) => void;
//   getOnlineUsers: () => void;
// };

// /**
//  * Events received from server
//  */
// interface MessageEvent {
//   senderId: string;
//   receiverId: string;
//   message: string;
//   images?: string[];
//   timestamp: string;
// }

// interface OnlineUsersEvent {
//   id: string;
//   username: string;
//   isOnline: boolean;
//   lastSeen?: string;
// }

// interface UserTypingEvent {
//   userId: string;
//   receiverId: string;
// }

// interface ErrorEvent {
//   message: string;
// }

// interface StatusEvent {
//   success: boolean;
//   message?: string;
// }

// type ServerToClientEvents = {
//   message: (msg: MessageEvent) => void;
//   onlineUsers: (users: OnlineUsersEvent[]) => void;
//   userTyping: (data: UserTypingEvent) => void;
//   userStoppedTyping: (data: UserTypingEvent) => void;
//   error: (err: ErrorEvent) => void;
//   status: (data: StatusEvent) => void;
// };

// /**
//  * Context value type
//  */
// export type SocketContextType = {
//   socket: Socket<ClientToServerEvents, ServerToClientEvents> | null;
//   isConnected: boolean;
//   isAuthenticated: boolean;
//   connect: () => void;
//   disconnect: () => void;
//   authenticate: (token: string) => Promise<boolean>;
//   sendMessage: (receiverId: string, message: string, images?: string[]) => void;
//   startTyping: (receiverId: string) => void;
//   stopTyping: (receiverId: string) => void;
//   getOnlineUsers: () => void;
// };

// // === 🔗 Environment Variable (Recommended) ===
// const SOCKET_URL =
//   process.env.NEXT_PUBLIC_SOCKET_URL || "https://bajram-server.code-commando.com";

// if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
//   console.warn("⚠️ NEXT_PUBLIC_SOCKET_URL not set, using fallback");
// }

// // === 🪝 Create Context with Proper Type ===
// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   isConnected: false,
//   isAuthenticated: false,
//   connect: () => {},
//   disconnect: () => {},
//   authenticate: async () => false,
//   sendMessage: () => {},
//   startTyping: () => {},
//   stopTyping: () => {},
//   getOnlineUsers: () => {},
// });

// // === 🏗️ Provider Component ===
// export function SocketProvider({ children }: { children: ReactNode }) {
//   const socketRef = useRef<Socket<ClientToServerEvents, ServerToClientEvents> | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const connect = () => {
//     if (socketRef.current?.connected) return;

//     // Disconnect any existing socket
//     socketRef.current?.disconnect();

//     console.log("🔌 Connecting to:", SOCKET_URL);

//     const newSocket = io<ClientToServerEvents, ServerToClientEvents>(SOCKET_URL, {
//       path: "/socket.io",
//       transports: ["websocket"],
//       autoConnect: false,
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     socketRef.current = newSocket;

//     // === Event Listeners ===
//     newSocket.on("connect", () => {
//       console.log("✅ Socket connected:", newSocket.id);
//       setIsConnected(true);
//     });

//     newSocket.on("disconnect", (reason) => {
//       console.log("❌ Disconnected:", reason);
//       setIsConnected(false);
//       setIsAuthenticated(false);
//     });

//     newSocket.on("connect_error", (err) => {
//       console.error("⚠️ Connect error:", err.message || err);
//       setIsConnected(false);
//     });

//     newSocket.on("message", (msg: MessageEvent) => {
//       console.log("📩 Message received:", msg);
//     });

//     newSocket.on("onlineUsers", (users: OnlineUsersEvent[]) => {
//       console.log("🟢 Online users:", users);
//     });

//     newSocket.on("userTyping", (data: UserTypingEvent) => {
//       console.log("✍️ User typing:", data);
//     });

//     newSocket.on("userStoppedTyping", (data: UserTypingEvent) => {
//       console.log("🛑 User stopped typing:", data);
//     });

//     newSocket.on("error", (err: ErrorEvent) => {
//       console.error("🔥 Server error:", err.message);
//     });

//     newSocket.on("status", (data: StatusEvent) => {
//       console.log("🔑 Auth status:", data);
//       setIsAuthenticated(data.success);
//     });

//     newSocket.connect();
//   };

//   const disconnect = () => {
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//       socketRef.current = null;
//       setIsConnected(false);
//       setIsAuthenticated(false);
//       console.log("🔌 Socket manually disconnected");
//     }
//   };

//   const authenticate = async (token: string): Promise<boolean> => {
//     if (!socketRef.current) return false;

//     return new Promise((resolve) => {
//       const timeout = setTimeout(() => {
//         console.warn("⏰ Authentication timed out after 10s");
//         socketRef.current?.off("status", handler);
//         resolve(false);
//       }, 10_000);

//       const handler = (data: StatusEvent) => {
//         clearTimeout(timeout);
//         setIsAuthenticated(data.success);
//         resolve(data.success);
//       };

//       // Listen once
//       socketRef.current.once("status", handler);

//       // Send auth request
//       socketRef.current.emit("authenticate", { token });
//     });
//   };

//   // === 🔊 Message & Typing Methods ===
//   const sendMessage = (
//     receiverId: string,
//     message: string,
//     images: string[] = []
//   ) => {
//     if (!socketRef.current || !isAuthenticated) return;
//     const payload: SendMessagePayload = { receiverId, message, images };
//     socketRef.current.emit("sendMessage", payload);
//   };

//   const startTyping = (receiverId: string) => {
//     if (!socketRef.current || !isAuthenticated) return;
//     socketRef.current.emit("typing", { receiverId });
//   };

//   const stopTyping = (receiverId: string) => {
//     if (!socketRef.current || !isAuthenticated) return;
//     socketRef.current.emit("stopTyping", { receiverId });
//   };

//   const getOnlineUsers = () => {
//     if (!socketRef.current || !isAuthenticated) return;
//     socketRef.current.emit("getOnlineUsers");
//   };

//   // === 💡 Auto-connect on mount ===
//   useEffect(() => {
//     connect();

//     return () => {
//       disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider
//       value={{
//         socket: socketRef.current,
//         isConnected,
//         isAuthenticated,
//         connect,
//         disconnect,
//         authenticate,
//         sendMessage,
//         startTyping,
//         stopTyping,
//         getOnlineUsers,
//       }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// }

// // === 🎯 Custom Hook with Full Type Safety ===
// export const useSocket = (): SocketContextType => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error("useSocket must be used within a SocketProvider");
//   }
//   return context;
// };