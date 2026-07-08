import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true }, // this will be used as title in frontend
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Internship", "Full-time", "Part-time"],
      default: "Full-time",
    },
    stipend: { type: String, default: "" },
    skills: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);