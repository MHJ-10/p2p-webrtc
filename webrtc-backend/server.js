// server.js
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
  })
);
app.use(express.json());

// === In-memory storage ===
// key = roomId, value = array of users (max 2)
const rooms = new Map(); // Map<string, User[]>

// util to generate random IDs
function generateId() {
  return crypto.randomUUID();
}

// simple root route to check server
app.get("/", (req, res) => {
  res.send("WebRTC backend server is running ✅");
});

// === CREATE ROOM ===
app.post("/create-room", (req, res) => {
  const { user } = req.body;

  // validate input
  if (!user || !user.id || !user.name) {
    return res
      .status(400)
      .json({ success: false, message: "invalid user data" });
  }

  const roomId = generateId();

  // save new room with this user
  rooms.set(roomId, [user]);

  console.log(`Room created: ${roomId} by ${user.name}`);

  res.json({ success: true, roomId });
});

// === JOIN ROOM ===
app.post("/join-room", (req, res) => {
  const { roomId, user } = req.body;

  // validation
  if (!roomId || !user || !user.id || !user.name) {
    return res.status(400).json({ success: false, message: "invalid payload" });
  }

  const room = rooms.get(roomId);

  if (!room) {
    return res.json({ success: false, message: "room not exist" });
  }

  // check if user already in room
  const existingUser = room.find((u) => u.id === user.id);
  if (existingUser) {
    return res.json({ success: true });
  }

  // check if room full
  if (room.length >= 2) {
    return res.json({ success: false, message: "room is filled" });
  }

  // add user to room
  room.push(user);
  rooms.set(roomId, room);

  console.log(`User ${user.name} joined room ${roomId}`);
  return res.json({ success: true });
});

// === GET ALL ROOMS (for debugging) ===
app.get("/rooms", (req, res) => {
  const allRooms = [];

  for (const [roomId, users] of rooms.entries()) {
    allRooms.push({
      roomId,
      users,
    });
  }

  res.json(allRooms);
});

// === DELETE ROOM ===
app.delete("/room/:roomId", (req, res) => {
  const { roomId } = req.params;

  if (!rooms.has(roomId)) {
    return res.json({ success: false, message: "room not found" });
  }

  rooms.delete(roomId);
  console.log(`Room deleted: ${roomId}`);

  res.json({ success: true, message: "room deleted" });
});

// implement websocket
const { WebSocketServer } = require("ws");
const http = require("http");

// create HTTP server from Express app
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// helper to find room by userId
function findRoomByUserId(userId) {
  for (const [roomId, users] of rooms.entries()) {
    if (users.find((u) => u.id === userId)) {
      return roomId;
    }
  }
  return null;
}

// map: userId -> ws
const sockets = new Map();

// === WebSocket connection handling ===
wss.on("connection", (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomId = url.pathname.split("/").pop();
  const userId = url.searchParams.get("userId");

  if (!roomId || !userId) {
    ws.close();
    return;
  }

  console.log(`🔗 WS connected: user ${userId} joined room ${roomId}`);

  sockets.set(userId, ws);

  // notify the other peer if exists
  const room = rooms.get(roomId);
  if (room) {
    const otherUser = room.find((u) => u.id !== userId);
    if (otherUser && sockets.has(otherUser.id)) {
      sockets.get(otherUser.id).send(
        JSON.stringify({
          type: "peer-joined",
          userId,
        })
      );
    }
  }

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    const { type, data } = msg;

    const currentRoomId = findRoomByUserId(userId);
    if (!currentRoomId) return;

    const currentRoom = rooms.get(currentRoomId);
    const target = currentRoom?.find((u) => u.id !== userId);
    if (!target) return;

    const targetSocket = sockets.get(target.id);
    if (targetSocket && targetSocket.readyState === targetSocket.OPEN) {
      targetSocket.send(JSON.stringify({ type, data, from: userId }));
    }
  });

  ws.on("close", () => {
    sockets.delete(userId);
    console.log(`❌ WS disconnected: ${userId}`);
  });
});

// start both HTTP + WS server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running with WebSocket on http://localhost:${PORT}`);
});
