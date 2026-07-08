import Application from "../models/Application.js";

// GET all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId", "name email branch year")
      .populate("jobId", "company role location deadline")
      .sort({ appliedDate: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// UPDATE application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Reviewed", "Selected", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("studentId", "name email branch year")
      .populate("jobId", "company role location deadline");

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update application status",
      error: error.message,
    });
  }
};

// DELETE application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedApplication = await Application.findByIdAndDelete(id);

    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete application",
      error: error.message,
    });
  }
};