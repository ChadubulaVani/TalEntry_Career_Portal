import express from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

const router = express.Router();

// GET /api/jobs -> list active jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });

    console.log("TOTAL JOBS FROM DB:", jobs.length);

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Get Jobs Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// GET /api/jobs/:id -> get single job
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    console.error("Get Single Job Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// POST /api/jobs/apply -> apply for a job
router.post("/apply", async (req, res) => {
  try {
    const { studentId, jobId } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ❌ DEADLINE CHECK REMOVED (important)

    const alreadyApplied = await Application.findOne({ studentId, jobId });

    if (alreadyApplied) {
      return res.status(400).json({ message: "You already applied for this job" });
    }

    const newApplication = new Application({
      studentId,
      jobId,
      status: "Pending",
      appliedDate: new Date(),
    });

    await newApplication.save();

    res.status(201).json({
      message: "Applied successfully",
      application: newApplication,
    });
  } catch (err) {
    console.error("Apply Job Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

export default router;