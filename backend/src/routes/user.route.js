import express from "express";
import { getUserStats, updateWeight, updateUserProfile, setAsActive, incrementPlanWeek } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", protectRoute, getUserStats);
router.post("/weight", protectRoute, updateWeight);
router.put("/profile", protectRoute, updateUserProfile);

router.put("/active-plan", protectRoute, setAsActive);
router.put("/active-plan/increment-week", protectRoute, incrementPlanWeek);

export default router;