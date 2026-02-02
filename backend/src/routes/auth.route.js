import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { ajLogin, ajSignup, ajAuth} from "../lib/arcjet.js";

const router = express.Router();

router.post("/signup", arcjetProtection(ajSignup),signup);
router.post("/login", arcjetProtection(ajLogin), login);
router.post("/logout", arcjetProtection(ajAuth), logout);

router.get("/check", protectRoute, arcjetProtection(ajAuth), (req, res) => res.status(200).json(req.user));
router.put("/update-profile", protectRoute, arcjetProtection(ajAuth), updateProfile);

export default router;