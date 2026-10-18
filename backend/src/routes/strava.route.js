import express from "express";
import { getStravaAuthUrl, getWeeklyStravaRuns, stravaDisconnect, stravaTokenExchange, getStravaRunDetails, getUserInfo, getStravaStats } from "../controllers/strava.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { ajAuth } from "../lib/arcjet.js";
import { checkStravaToken } from "../middleware/strava.middleware.js";

const router = express.Router();

// strava connection endpoints
router.get("/connect", protectRoute, arcjetProtection(ajAuth), getStravaAuthUrl);
router.get("/callback", arcjetProtection(ajAuth), stravaTokenExchange);
router.delete("/disconnect", protectRoute, arcjetProtection(ajAuth), checkStravaToken, stravaDisconnect);

// strava fetching info endpoints
router.get("/runs", protectRoute, arcjetProtection(ajAuth), checkStravaToken, getWeeklyStravaRuns);
router.get("/runs/athlete", protectRoute, arcjetProtection(ajAuth), checkStravaToken, getUserInfo);
router.get("/runs/stats", protectRoute, arcjetProtection(ajAuth), checkStravaToken, getStravaStats);
router.get("/runs/:id", protectRoute, arcjetProtection(ajAuth), checkStravaToken, getStravaRunDetails);

export default router;