import express from "express";
import { getStravaAuthUrl, stravaDisconnect, stravaTokenExchange } from "../controllers/strava.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { ajAuth } from "../lib/arcjet.js";
import { checkStravaToken } from "../middleware/strava.middleware.js";

const router = express.Router();

router.get("/connect", protectRoute, arcjetProtection(ajAuth), getStravaAuthUrl);
router.get("/callback", arcjetProtection(ajAuth), stravaTokenExchange);
router.delete("/disconnect", protectRoute, arcjetProtection(ajAuth), checkStravaToken, stravaDisconnect);

export default router;