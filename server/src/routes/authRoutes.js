import express from "express";
import {
	register,
	login,
	getMe,
	googleSignIn,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleSignIn);
router.get("/me", protect, getMe);

export default router;
