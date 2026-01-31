import express from "express";
import { createPlan, getPlans, getSinglePlan, updatePlan, deletePlan } from "../controllers/workouts.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { ajAuth } from "../lib/arcjet.js";

const router = express.Router();

// new training plan
router.post("/plans", protectRoute, arcjetProtection(ajAuth), createPlan);

// get all user plans
router.get("/plans", protectRoute, arcjetProtection(ajAuth), getPlans);

// get single plan
router.get("/plans/:id", protectRoute, arcjetProtection(ajAuth), getSinglePlan);

// update plan
router.put("/plans/:id", protectRoute, arcjetProtection(ajAuth), updatePlan);

// delete plan
router.delete("/plans/:id", protectRoute, arcjetProtection(ajAuth), deletePlan);

export default router;