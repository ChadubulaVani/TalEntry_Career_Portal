import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // relative to backend folder
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

// Optional file filter: allow pdf/doc/docx only
const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF/DOC/DOCX allowed"), false);
};

const upload = multer({ storage, fileFilter });

// POST /api/resume/upload/:studentId  (form-data key: resume)
router.post("/upload/:studentId", upload.single("resume"), async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // store file path in DB (example: uploads/123.pdf)
    const resumePath = req.file.path.replace(/\\/g, "/");

    const user = await User.findByIdAndUpdate(
      studentId,
      { resume: resumePath },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      msg: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// GET /api/resume/:studentId  -> returns resume URL/path
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const user = await User.findById(studentId).select("resume");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ resume: user.resume || "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;