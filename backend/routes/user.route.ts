import mongoose, { Types } from "mongoose";
import { Request, Response, Router } from "express";
import dotenv from "dotenv";
import Post from "../models/Post";
import authMiddleware from "../middleware/authMiddleware";
import User, { IUser } from "../models/User";
import { validateObjectId } from "../middleware/validateObjectId";

dotenv.config();

const user = Router();

user.get(
  "/profile/:userId/",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ success: false, message: "Invalid userId" });
        return;
      }

      // Find the user by ID
      const user = await User.findById(userId)
        .populate<{
          following: IUser[];
          followers: IUser[];
          notifications: { type: string; from: IUser; createdAt: Date }[];
        }>("following followers", "username profileImg")
        // }>("following followers notifications", "username profileImg")
        // .slice("notifications", -10) // last 10 notifications
        .exec();

      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      // Fetch posts created by the user
      const userPosts = await Post.find({ user: userId })
        .populate("user", "username profileImg")
        .sort({ createdAt: -1 });

      // Fetch posts liked by the user
      const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
        .populate("user", "username profileImg")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        user: {
          username: user.username,
          bio: user.bio,
          profileImg: user.profileImg,
          coverImg: user.coverImg,
          following: user.following.map((user) => ({
            _id: user.id,
            username: user.username,
            profileImg: user.profileImg,
          })),
          followers: user.followers.map((user) => ({
            _id: user.id,
            username: user.username,
            profileImg: user.profileImg,
          })),
          // noifications: user.notifications,
          userPosts,
          likedPosts: likedPosts,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

user.get(
  "/get-all-posts",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const allPosts = await Post.find().populate(
        "user",
        "username profileImg id"
      );
      const allPostsSimpleUsernames = allPosts.map((post) => ({
        postId: post._id,
        content: post.content,
        img: post.img,
        createdAt: post.createdAt,
        user: {
          username: post.user.username,
          profileImg: post.user.profileImg,
          _id: post.user._id,
        },
      }));

      res.json(allPostsSimpleUsernames);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Something went wrong", error });
    }
  }
);

user.post(
  "/:userId/follow/:followedId",
  validateObjectId,
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const followedId = req.params.followedId;

      // Find both users
      const user = await User.findById(userId);
      const followedUser = await User.findById(followedId);

      if (!user || !followedUser) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      const userObjectId = new Types.ObjectId(user._id);
      const followedObjectId = new Types.ObjectId(followedUser._id);

      // Check if the user is already following the followed user
      if (user.following.includes(followedObjectId)) {
        res
          .status(400)
          .json({ success: false, message: "Already following this user" });
        return;
      }

      // Add the sender to the receiver's followers
      followedUser.followers.push(userObjectId);

      // Add the receiver to the sender's following
      user.following.push(followedObjectId);

      // Add a notification for the receiver
      followedUser.notifications.push({
        type: "follow",
        from: userObjectId,
        createdAt: new Date(),
      });

      // Save both users
      await Promise.all([user.save(), followedUser.save()]);

      res.json({
        success: true,
        message: "Followed successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

user.post(
  "/:userId/unfollow/:followedId",
  validateObjectId,
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const followedId = req.params.followedId;

      // Find both users
      const user = await User.findById(userId);
      const followedUser = await User.findById(followedId);

      if (!user || !followedUser) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      const userObjectId = new Types.ObjectId(user._id);
      const followedObjectId = new Types.ObjectId(followedUser._id);

      // Check if the user is following the followed user
      if (!user.following.includes(followedObjectId)) {
        res
          .status(400)
          .json({ success: false, message: "Not following this user" });
        return;
      }

      // Remove the sender from the receiver's followers
      followedUser.followers = followedUser.followers.filter(
        (follower) => !follower.equals(userObjectId)
      );

      // Remove the receiver from the sender's following
      user.following = user.following.filter(
        (following) => !following.equals(followedObjectId)
      );

      // Save both users
      await Promise.all([user.save(), followedUser.save()]);

      res.json({
        success: true,
        message: "Unfollowed successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

user.post("/post", authMiddleware, (req: Request, res: Response) => {
  try {
    const { content, img, user } = req.body;

    const newPost = new Post({
      content,
      img,
      user,
    });

    const savedNewPost = newPost.save();

    res.status(201).json({
      success: true,
      message: "Posted Successfully",
      data: savedNewPost,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: error });
  }
});

user.delete(
  "/delete-post",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { postId } = req.body;
      const userId = req.user?.id;

      if (!postId) {
        res
          .status(400)
          .json({ success: false, message: "Post ID is required" });
        return;
      }

      const postToDelete = await Post.findById(postId);
      if (!postToDelete) {
        res.status(404).json({ success: false, message: "Post not found" });
        return;
      }

      // Ensure the post belongs to the authenticated user
      if (!postToDelete.user.equals(userId)) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      // Delete the post
      await Post.findByIdAndDelete(postId);

      res
        .status(200)
        .json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

user.patch(
  "/update-profile",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { bio, profileImg, coverImg } = req.body as {
        bio: string;
        profileImg: string;
        coverImg: string;
      };

      // Validate input
      if (bio && typeof bio !== "string") {
        res
          .status(400)
          .json({ success: false, message: "Bio must be a string" });
        return;
      }

      if (bio && bio.length > 120) {
        res.status(400).json({
          success: false,
          message: "Bio must be shorter than 120 characters",
        });
      }
      if (profileImg && typeof profileImg !== "string") {
        res.status(400).json({
          success: false,
          message: "Profile image URL must be a string",
        });
        return;
      }
      if (coverImg && typeof coverImg !== "string") {
        res.status(400).json({
          success: false,
          message: "Cover image URL must be a string",
        });
        return;
      }

      // Extract user ID from the authenticated user (set by authMiddleware)
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      // Update the user document
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { bio, profileImg, coverImg } }, // Only update the provided fields
        { new: true, runValidators: true } // Return the updated document and validate the update
      );

      if (!updatedUser) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      // Respond with the updated user data
      res.json({
        sucess: true,
        message: "Profile updated successfully",
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          bio: updatedUser.bio,
          profileImg: updatedUser.profileImg,
          coverImg: updatedUser.coverImg,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Something went wrong", error });
    }
  }
);

export default user;
