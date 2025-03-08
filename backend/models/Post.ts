import { Schema, model } from "mongoose";

const PostSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
});

PostSchema.index({ content: "text" });

export default model("Post", PostSchema);
