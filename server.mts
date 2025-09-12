// server.js
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  // Create Socket.IO server
  const io = new Server(httpServer);

  // // 🔥 Make io available to API routes
  // globalThis.io = io;

  io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);

    socket.on("join-room", ({ room, sender }) => {
      console.log(`user ${sender.fullName} joined room ${room}`);
      socket.join(room);
      socket.to(room).emit("user-joined", `${sender.fullName} Online`);
    });

    socket.on("message", (message) => {
      console.log(
        `Message from ${message.senderId} in room ${message.conversationId}: ${message.content}`,
      );
      socket.to(message.conversationId).emit("message", message); // ✅ includes sender
    });

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
