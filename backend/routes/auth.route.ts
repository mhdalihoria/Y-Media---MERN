import dotenv from "dotenv";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import validateRequest from "../middleware/validateRequest";
import User from "../models/User";
import jwt from "jsonwebtoken";

dotenv.config();

const auth = Router();

auth.post(
  "/signup",
  [
    body("username").trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, username, password } = req.body;

      //   check for existing user
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        res
          .status(400)
          .json({ succces: false, message: "User Already Exists" });
      }

      //   saving new user
      const newUser = new User({ username, email, password });

      await newUser.save();

      //   JsonWebToken
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res
        .status(201)
        .json({ success: true, message: "Sign-up Successful", token });
    } catch (err) {
      res.status(500).json({ success: false, message: "Registeration Failed" });
    }
  }
);
auth.post("/login", (req: Request, res: Response) => {});

export default auth;
