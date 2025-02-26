import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, followedId } = req.params;

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({
      success: false,
      message: "Invalid userId",
    });
    return;
  }

  // Check if followedId is a valid ObjectId
  if (followedId && !mongoose.Types.ObjectId.isValid(followedId)) {
    res.status(400).json({
      success: false,
      message: "Invalid followedId",
    });
    return;
  }

  next();
};
