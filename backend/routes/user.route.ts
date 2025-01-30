import { Request, Response, Router } from "express";
import dotenv from "dotenv";

dotenv.config();

const user = Router();

user.post("/post", (req: Request, res: Response) => {
  try {
    res.status(200).json({success: true, message: "Uploaded Successfully"});
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: error });
  }
});

export default user
