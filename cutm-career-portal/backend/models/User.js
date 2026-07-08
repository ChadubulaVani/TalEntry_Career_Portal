import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "admin", "recruiter"],
      default: "student",
    },

    phone: {
  type: String,
  default: "",
},

    branch: {
      type: String,
      default: "",
    },

    year: {
      type: Number,
      default: null,
    },

    resume: {
      type: String,
      default: "",
    },

    otp: {
      type: String,
      default: "",
    },

    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);