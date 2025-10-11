const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const cors = require("cors");
const helmet = require("helmet");
const { nanoid } = require("nanoid");

// ===== Express REST API =====
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const server = http.createServer(app);

// ===== In-memory rooms =====
// roomId -> { clients: Set<WebSocket>, createdAt: number }
const rooms = new Map();

// Create room
app.post("/api/rooms", (req, res) => {
  const roomId = crypto.randomUUID();
  rooms.set(roomId, { clients: new Set(), createdAt: Date.now() });
  console.log(`Room created: ${roomId}`);
  res.json({ roomId });
});

// Check room
app.get("/api/rooms/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const room = rooms.get(roomId);
  if (!room) return res.status(404).json({ exists: false });
  res.json({ exists: true, clientsCount: room.clients.size });
});

// ===== WebSocket server =====
const wss = new WebSocketServer({ server });
console.log("WebSocket server running on same port as REST API");

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Track the room of this socket
  let currentRoomId = null;

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    // Join room
    if (message.type === "join-room") {
      const roomId = message.roomId;
      const room = rooms.get(roomId);
      if (!room) {
        ws.send(JSON.stringify({ type: "error", reason: "room-not-found" }));
        return;
      }
      if (room.clients.size >= 2) {
        ws.send(JSON.stringify({ type: "error", reason: "room-full" }));
        return;
      }

      room.clients.add(ws);
      currentRoomId = roomId;
      ws.send(
        JSON.stringify({
          type: "joined-room",
          isInitiator: room.clients.size === 1,
        })
      );
      console.log(`Client joined room ${roomId}`);
    }

    // Forward signaling messages
    if (message.type === "signal") {
      const roomId = message.roomId;
      const payload = message.payload;
      const room = rooms.get(roomId);
      if (!room) return;
      room.clients.forEach((peer) => {
        if (peer !== ws) peer.send(JSON.stringify({ type: "signal", payload }));
      });
    }

    // Leave room voluntarily
    if (message.type === "leave-room") {
      leaveRoom(ws);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    leaveRoom(ws);
  });

  function leaveRoom(socket) {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    room.clients.delete(socket);
    room.clients.forEach((peer) =>
      peer.send(JSON.stringify({ type: "peer-left" }))
    );

    if (room.clients.size === 0) {
      rooms.delete(currentRoomId);
      console.log(`Room deleted: ${currentRoomId}`);
    }

    currentRoomId = null;
  }
});

// ===== Start server =====
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
