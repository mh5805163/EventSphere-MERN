
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    type: {
      type: String,
      enum: ["suggestion", "issue", "review"],
      default: "suggestion",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    reply: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model("Feedback", feedbackSchema);
