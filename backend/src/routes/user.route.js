import express from "express";
import { getUserStats, updateWeight, updateUserProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", protectRoute, getUserStats);
router.post("/weight", protectRoute, updateWeight);
router.put("/profile", protectRoute, updateUserProfile);

export default router;