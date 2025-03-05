import { Router, Request, Response } from "express";
import User, { IUser } from "../models/User"; // your User model
import authMiddleware from "../middleware/authMiddleware";

const notification = Router();

notification.get(
  "/get-all",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      const user = await User.findById(userId)
        .select("notifications")
        .populate<{
          notifications: { type: string; from: IUser; createdAt: Date }[];
        }>(
          "notifications.from", // Populate the 'from' field inside notifications
          "username profileImg" // Only retrieve these fields
        )
        .slice("notifications", -10);

      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      res.json({ success: true, data: user.notifications });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Something went wrong", error });
    }
  }
);

//TODO: REMOVE NOTIFICATION IF UNFOLLOWED
notification.post(
  "/add-notification",
  authMiddleware,
  async (req: Request, res: Response) => {
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

      res.status(200).json({
        success: true,
        notification: newNotification,
        message: "Notification Added Successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default notification;
