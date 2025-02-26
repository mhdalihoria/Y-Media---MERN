import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  bio: string;
  profileImg: string;
  coverImg: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  likedPosts: Types.ObjectId[]; // Array of post IDs (liked by the user)
  followers: Types.ObjectId[]; // Array of user IDs who follow this user
  following: Types.ObjectId[]; // Array of user IDs this user is following
  notifications: {
    type: "follow" | "message" | "like"; // Type of notification (e.g., follow)
    from: Types.ObjectId; // User ID of the sender
    createdAt: Date; // Timestamp of the notification
  }[]; // Array of notifications
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    bio: {
      type: String,
      required: false,
      default: "",
    },
    profileImg: {
      type: String,
      required: false,
      default: null,
    },
    coverImg: {
      type: String,
      required: false,
      default: null,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
    likedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post", // Reference to the Post model
      },
    ],
    notifications: [
      {
        type: {
          type: String,
          enum: ["follow", "message", "like"],
          required: true,
        },
        from: { type: Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password verification method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser>("User", UserSchema);
