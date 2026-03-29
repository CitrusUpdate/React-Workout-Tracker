import express from "express";
import { getNotifications, markAsRead, clearNotifications } from "../controllers/notifications.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.patch("/:id/read", protectRoute, markAsRead);
router.delete("/clear", protectRoute, clearNotifications);

export default router;