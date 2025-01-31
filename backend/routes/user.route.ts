import { Request, Response, Router } from "express";
import dotenv from "dotenv";
import Post from "../models/Post";

dotenv.config();

const user = Router();

user.post("/post", (req: Request, res: Response) => {
  try {
    const { content, img } = req.body;

    const newPost = new Post({
      content,
      img,
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

user.get("/get-all-posts", async (req: Request, res: Response) => {
  try {
    const allPosts = await Post.find();

    res.json(allPosts);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
});

export default user;
