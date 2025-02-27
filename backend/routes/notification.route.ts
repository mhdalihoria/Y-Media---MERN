import { Router, Request, Response } from "express";
import User from "../models/User"; // your User model
import authMiddleware from "../middleware/authMiddleware";

const notification = Router();

notification.post("/notify", authMiddleware, async (req: Request, res: Response) => {
  // Expecting: { toUserId, type, fromUserId }
  const { toUserId, type, fromUserId } = req.body;

  try {
    // Find the target user
    const user = await User.findById(toUserId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Create a new notification object
    const newNotification = {
      type, // e.g., "follow", "message", or "like"
      from: fromUserId,
      createdAt: new Date(),
    };

    // Add notification to the user's notifications array and save
    user.notifications.push(newNotification);
    await user.save();

    // Get the Socket.IO instance from the Express app
    const io = req.app.get("io");
    // Emit the notification to the room named after the target user's ID
    io.to(toUserId).emit("notification", newNotification);

    res.status(200).json({ success: true, notification: newNotification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default notification;
