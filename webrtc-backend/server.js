// server.js
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
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

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
