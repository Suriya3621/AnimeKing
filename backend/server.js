const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();
const db = require("./config/db.js");
const cors = require("cors");
const animeRoutes = require("./routes/AnimeRoutes.js");

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Update with your frontend URL in production
  },
});

// Middleware
app.use(express.json());
db();
app.use(cors());
app.use("/api", animeRoutes);

// Visitor Count
let visitorCount = 0;

// Listen for connections
io.on("connection", (socket) => {
  visitorCount++;
  console.log(`A user connected. Total visitors: ${visitorCount}`);

  // Emit updated visitor count to all clients
  io.emit("visitorCount", visitorCount);

  socket.on("disconnect", () => {
    visitorCount--;
    console.log(`A user disconnected. Total visitors: ${visitorCount}`);
    io.emit("visitorCount", visitorCount);
  });
});

// Server listener
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});