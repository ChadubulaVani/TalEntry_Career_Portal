import Job from "../models/Job.js";

// GET all jobs for admin
export const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// CREATE job
export const createJob = async (req, res) => {
  try {
    const { company, role, description, location, deadline } = req.body;

    if (!company || !role || !deadline) {
      return res.status(400).json({
        message: "Company, role and deadline are required",
      });
    }

    const job = await Job.create({
      company,
      role,
      description,
      location,
      deadline,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// UPDATE job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, role, description, location, deadline } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        company,
        role,
        description,
        location,
        deadline,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update job",
      error: error.message,
    });
  }
};

// DELETE job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete job",
      error: error.message,
    });
  }
};