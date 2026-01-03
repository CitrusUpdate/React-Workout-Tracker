import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

const app = express();
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json( { limit: "15mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

if(ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

app.listen(PORT, () => {
    console.log("Server running on port ", PORT);
    connectDB();
});