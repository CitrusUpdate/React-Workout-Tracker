import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./routes/auth.route.js";
import workoutRoutes from "./routes/workouts.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import notificationRoutes from "./routes/notifications.route.js";
import userRoutes from "./routes/user.route.js";
import { startAnalyticsJob } from "./job/analytics.job.js";
import stravaRoutes from "./routes/strava.route.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

const app = express();

app.use(helmet());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json( { limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// auth
app.use("/api/auth", authRoutes);

// workouts
app.use("/api/workouts", workoutRoutes);

// notifications
app.use("/api/notifications", notificationRoutes);

// user stats
app.use("/api/users", userRoutes);

// strava
app.use("/api/strava", stravaRoutes);

// deployment
if(ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

app.listen(PORT, () => {
    console.log("Server running on port ", PORT);
    connectDB();

    startAnalyticsJob();
});