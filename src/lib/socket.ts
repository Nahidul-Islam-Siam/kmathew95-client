// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket(token: string) {
  if (socket) return socket;

 socket = io("http://10.0.20.98:6565", {
    transports: ["websocket"], // force ws only
    auth: {
      token, // ✅ send token in handshake payload
    },
  });
  socket.on("connect", () => {
    console.log("✅ Connected to socket server", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connect error:", err.message);
  });

  return socket;
}

export function getSocket() {
  return socket;
}
