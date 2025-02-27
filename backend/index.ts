import mongoose from "mongoose";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "./routes/cloudinary.route";
import user from "./routes/user.route";
import auth from "./routes/auth.route";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import notification from "./routes/notification.route";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.use("/api/cloudinary", cloudinary);
app.use("/user", user);
app.use("/auth", auth);
app.use("/notifications", notification);

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Initialize Socket.IO and attach it to the HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173", // your front-end URL
    methods: ["GET", "POST"],
  },
});

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  // Allow clients to join a room based on their user ID
  socket.on("join", (userId: string) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});

// Make the io instance accessible in your routes if needed
app.set("io", io);

// MongoDB connection
function connect() {
  mongoose.connection.on("connected", () => console.log("DB connected"));
  mongoose.connection.on("error", (error) => console.log("DB Error", error));

  return mongoose.connect(process.env.MONGO_URI || "");
}

connect();

server.listen(port, () => {
  console.log(`Server running @ http://localhost:${port}`);
});
