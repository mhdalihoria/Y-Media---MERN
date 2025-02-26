import { Types } from "mongoose";
import { Request, Response, Router } from "express";
import dotenv from "dotenv";
import Post from "../models/Post";
import authMiddleware from "../middleware/authMiddleware";
import User, { IUser } from "../models/User";

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
        return res.status(400).json({ success: false, message: "Invalid userId" });
      }

      // Find the user by ID
      const user = await User.findById(userId)
        .populate<{ friends: IUser[] }>("friends", "username profileImg")
        .exec();

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
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
          friends: user.friends.map((friend) => ({
            username: friend.username,
            profileImg: friend.profileImg,
          })),
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
  "/:userId/add-friend/:friendId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;

      // Find both users
      const user = (await User.findById(userId)) as IUser;
      const friend = (await User.findById(friendId)) as IUser;

      if (!user || !friend) {
        res
          .status(404)
          .json({ success: false, message: "User or friend not found" });
        return;
      }

      const userObjectId = new Types.ObjectId(user._id as string);
      const friendObjectId = new Types.ObjectId(friend._id as string);

      // Check if the friend is already added
      if (user.friends.includes(friendObjectId)) {
        res
          .status(400)
          .json({ success: false, message: "Friend already added" });
        return;
      }

      // Add the friend to the user's friends array
      user.friends.push(friendObjectId);
      await user.save();

      // Optionally, add the user to the friend's friends array (for mutual friendship)
      friend.friends.push(userObjectId);
      await friend.save();

      res.json({ success: true, message: "Friend added successfully" });
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
