// server.js
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
  })
);
app.use(express.json());

// === In-memory storage ===
const rooms = new Map(); // Map<string, User[]>
const wsConnections = new Map(); // Map<userId, WebSocket>

// === Utils ===
function generateId() {
  return crypto.randomUUID();
}

// === Routes ===

// simple root route to check server
app.get("/", (req, res) => {
  res.send("WebRTC backend server is running ✅");
});

// === CREATE ROOM ===
app.post("/create-room", (req, res) => {
  const { user } = req.body;

  if (!user || !user.id || !user.name)
    return res
      .status(400)
      .json({ success: false, message: "invalid user data" });

  const roomId = generateId();
  rooms.set(roomId, [user]);

  console.log(`🟢 Room created: ${roomId} by ${user.name}`);
  res.json({ success: true, roomId });
});

// === JOIN ROOM ===
app.post("/join-room", (req, res) => {
  const { roomId, user } = req.body;

  if (!roomId || !user || !user.id || !user.name)
    return res.status(400).json({ success: false, message: "invalid payload" });

  const room = rooms.get(roomId);
  if (!room) return res.json({ success: false, message: "room not exist" });

  const existingUser = room.find((u) => u.id === user.id);
  if (existingUser) return res.json({ success: true });

  if (room.length >= 2)
    return res.json({ success: false, message: "room is filled" });

  room.push(user);
  rooms.set(roomId, room);

  console.log(`🟡 User ${user.name} joined room ${roomId}`);
  res.json({ success: true });
});

// === GET ALL ROOMS ===
app.get("/rooms", (req, res) => {
  const allRooms = [];
  for (const [roomId, users] of rooms.entries()) {
    allRooms.push({ roomId, users });
  }
  res.json(allRooms);
});

// === DELETE ROOM ===
app.delete("/room/:roomId", (req, res) => {
  const { roomId } = req.params;
  if (!rooms.has(roomId))
    return res.json({ success: false, message: "room not found" });

  rooms.delete(roomId);
  console.log(`🔴 Room deleted: ${roomId}`);
  res.json({ success: true, message: "room deleted" });
});

// === Create HTTP + WebSocket Server ===
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// === Handle WebSocket Connections ===
wss.on("connection", (ws) => {
  console.log("🧩 New WebSocket connection established");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      handleWsMessage(ws, data);
    } catch (err) {
      console.error("❌ Invalid WS message", err);
    }
  });

  ws.on("close", () => {
    // Cleanup user when disconnected
    for (const [userId, conn] of wsConnections.entries()) {
      if (conn === ws) {
        wsConnections.delete(userId);
        console.log(`⚪ User ${userId} disconnected`);

        // Remove user from any room
        for (const [roomId, users] of rooms.entries()) {
          const newUsers = users.filter((u) => u.id !== userId);
          if (newUsers.length === 0) {
            rooms.delete(roomId);
            console.log(`🧹 Room ${roomId} deleted (empty)`);
          } else {
            rooms.set(roomId, newUsers);
          }
        }
        break;
      }
    }
  });
});

// === WS Message Handler ===
function handleWsMessage(ws, data) {
  const { type, userId, roomId, payload } = data;

  switch (type) {
    case "join":
      wsConnections.set(userId, ws);
      ws.roomId = roomId;
      console.log(`🧑 User ${userId} connected to room ${roomId}`);

      const room = rooms.get(roomId);
      if (!room) return;

      // If there’s another peer in the room, notify both
      if (room.length === 2) {
        const [peer1, peer2] = room;
        sendToUser(peer1.id, { type: "ready", number: 2, peerId: peer2.id });
        sendToUser(peer2.id, { type: "ready", number: 1, peerId: peer1.id });
      }
      break;

    case "offer":
    case "answer":
    case "candidate":
      // forward signaling messages to other peer
      if (!roomId) return;
      const peers = rooms.get(roomId) || [];
      const target = peers.find((u) => u.id !== userId);
      if (target) sendToUser(target.id, data);
      break;

    case "leave":
      wsConnections.delete(userId);
      removeUserFromRoom(userId, roomId);
      break;

    default:
      console.log("Unknown WS message:", data);
  }
}

// === Helper: send message to user ===
function sendToUser(userId, data) {
  const conn = wsConnections.get(userId);
  if (conn && conn.readyState === 1) {
    conn.send(JSON.stringify(data));
  }
}

// === Helper: remove user from room ===
function removeUserFromRoom(userId, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  const updated = room.filter((u) => u.id !== userId);
  if (updated.length === 0) rooms.delete(roomId);
  else rooms.set(roomId, updated);
  console.log(`🚪 User ${userId} left room ${roomId}`);
}

// === Start Server ===
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running with WebSocket on http://localhost:${PORT}`);
});
