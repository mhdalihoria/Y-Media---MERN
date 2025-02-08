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

      // Find the user by ID
      const user = await User.findById(userId)
        .populate<{ friends: IUser[] }>("friends", "username profileImg")
        .exec();

      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      // Fetch posts created by the user
      const userPosts = await Post.find({ user: userId })
        .populate("user", "username")
        .sort({ createdAt: -1 });

      // Fetch posts liked by the user
      const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
        .populate("user", "username")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        user: {
          username: user.username,
          bio: user.bio,
          profileImg: user.profileImg,
          coverImg: user.coverImg,
          friends: user.friends.map((friend) => friend.username),
          posts: userPosts,
          likedPosts: likedPosts,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
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

user.get(
  "/get-all-posts",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const allPosts = await Post.find().populate("user", "username");
      const allPostsSimpleUsernames = allPosts.map((post) => ({
        content: post.content,
        img: post.img,
        createdAt: post.createdAt,
        user: post.user.username,
      }));

      res.json(allPostsSimpleUsernames);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Something went wrong", error });
    }
  }
);

export default user;
