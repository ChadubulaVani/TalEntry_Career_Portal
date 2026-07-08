import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// Get all applications of a student
router.get("/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const applications = await Application.find({ studentId }).populate("jobId");
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;