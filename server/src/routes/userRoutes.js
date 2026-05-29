import express from "express";
import { updateProfile, getAllUsers } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.get("/", protect, adminOnly, getAllUsers);

export default router;
