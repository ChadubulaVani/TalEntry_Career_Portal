import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },

    // Optional: if empty / missing => for all students
    targetUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);