import express from "express";
import User from "../models/User.js";
import Application from "../models/Application.js";

const router = express.Router();

// GET /api/dashboard/:studentId
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const user = await User.findById(studentId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const jobsAppliedCount = await Application.countDocuments({ studentId });

    res.json({
      user,
      stats: {
        jobsApplied: jobsAppliedCount,
        resumeUploaded: !!user.resume,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;