import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/adminController.js";
import {
  getAllJobsAdmin,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/adminJobController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/adminApplicationController.js";

const router = express.Router();

// USER ROUTES
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.put("/users/:id/role", authMiddleware, adminMiddleware, updateUserRole);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

// JOB ROUTES
router.get("/jobs", authMiddleware, adminMiddleware, getAllJobsAdmin);
router.post("/jobs", authMiddleware, adminMiddleware, createJob);
router.put("/jobs/:id", authMiddleware, adminMiddleware, updateJob);
router.delete("/jobs/:id", authMiddleware, adminMiddleware, deleteJob);

// APPLICATION ROUTES
router.get("/applications", authMiddleware, adminMiddleware, getAllApplications);
router.put(
  "/applications/:id/status",
  authMiddleware,
  adminMiddleware,
  updateApplicationStatus
);
router.delete(
  "/applications/:id",
  authMiddleware,
  adminMiddleware,
  deleteApplication
);

export default router;