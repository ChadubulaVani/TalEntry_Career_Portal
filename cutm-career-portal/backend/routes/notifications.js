import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// GET /api/notifications/:studentId
// - returns notifications targeted to that student OR global notifications (no targetUsers)
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const notifications = await Notification.find({
      $or: [
        { targetUsers: studentId }, // targeted to this student
        { targetUsers: { $exists: false } }, // field not present (global)
        { targetUsers: { $size: 0 } }, // empty array (global)
      ],
    }).sort({ date: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;