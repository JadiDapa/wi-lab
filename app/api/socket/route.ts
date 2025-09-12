// pages/api/socket.ts
import { Server as IOServer } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next"; // we'll define this type

export const config = {
  api: {
    bodyParser: false, // disable body parsing for socket
  },
};

// Extend res type for socket.io
export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (!res.socket.server.io) {
    console.log("🔌 New Socket.io server...");
    const io = new IOServer(res.socket.server as any, {
      path: "/api/socket/io", // 👈 path must match client
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);

      socket.on("message", (msg) => {
        console.log("📩 Received:", msg);
        io.emit("message", msg); // broadcast back
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
