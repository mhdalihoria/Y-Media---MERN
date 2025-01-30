import { Router } from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const cloudinary = Router();

// ✅ Cloudinary signature endpoint
cloudinary.post("/sign", (req, res) => {
  try {
    const cloudinarySecret = process.env.CLOUDINARY_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_NAME;
    const timestamp = Math.round(Date.now() / 1000).toString();

    const signature = crypto
      .createHash("sha1")
      .update(
        `timestamp=${timestamp}&upload_preset=${uploadPreset}${cloudinarySecret}`
      )
      .digest("hex");

    res.json({
      signature,
      timestamp,
      api_key: apiKey,
      cloud_name: cloudName,
      upload_preset: uploadPreset,
    });
  } catch (error) {
    console.error("Signature error:", error);
    res.status(500).json({ error: "Signature generation failed" });
  }
});

export default cloudinary;
