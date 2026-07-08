import express from "express";
import {
  registerUser,
  loginStep1,
  verifyOtpLogin,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login-step1", loginStep1);
router.post("/verify-otp", verifyOtpLogin);

export default router;