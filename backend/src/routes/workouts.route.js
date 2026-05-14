import express from "express";
import { createPlan, getPlans, getSinglePlan, updatePlan, deletePlan, instantiatePlanDay, createWorkout, getWorkouts, getSingleWorkout, updateSet, exportPlanCsv, exportWorkoutCsv, exportAllSessionsCsv, exportPlanPdf, exportWorkoutPdf, exportAllSessionsPdf, importPlanCsv } from "../controllers/workouts.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { ajAuth } from "../lib/arcjet.js";
import { upload } from "../middleware/upload.middleware.js";

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

// instantiate plan into workout session
router.post("/plans/:id/days/:dayIndex/instantiate", protectRoute, arcjetProtection(ajAuth), instantiatePlanDay);

// create manual workout (without plan)
router.post("/workouts", protectRoute, arcjetProtection(ajAuth), createWorkout);

// export all sessions to PDF
router.get("/workouts/export/all/pdf", protectRoute, /*arcjetProtection(ajAuth),*/ exportAllSessionsPdf);

// export all sessions to CSV
router.get("/workouts/export/all/csv", protectRoute, /*arcjetProtection(ajAuth),*/ exportAllSessionsCsv);

// get paginated workouts (with plan)
router.get("/workouts", protectRoute, arcjetProtection(ajAuth), getWorkouts);

// get single workout
router.get("/workouts/:id", protectRoute, arcjetProtection(ajAuth), getSingleWorkout);

// update single set; sessionId is which training is it, exerciseIndex is which exercise is it and setIndex is which set is it
router.patch("/workouts/:sessionID/exercises/:exerciseIndex/sets/:setIndex", protectRoute, arcjetProtection(ajAuth), updateSet);

// export plan to CSV
router.get("/plans/:id/export/csv", protectRoute, /*arcjetProtection(ajAuth),*/ exportPlanCsv);

// export workout to CSV
router.get("/workouts/:id/export/csv", protectRoute, /*arcjetProtection(ajAuth),*/ exportWorkoutCsv);

// export plan to PDF
router.get("/plans/:id/export/pdf", protectRoute, /*arcjetProtection(ajAuth),*/ exportPlanPdf);

// export workout to PDF
router.get("/workouts/:id/export/pdf", protectRoute, /*arcjetProtection(ajAuth),*/ exportWorkoutPdf);

// import plan (csv file)
router.post("/plans/import/csv", protectRoute, /*arcjetProtection(ajAuth),*/ upload.single("file"), importPlanCsv);

export default router;