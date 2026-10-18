import { isTokenExpired } from "../utils/strava.js";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const checkStravaToken = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if(!user.stravaAuth?.refreshToken || !user.stravaAuth?.expiresAt) return res.status(400).json({ message: "Strava account not connected"})

        const { expiresAt, refreshToken } = user.stravaAuth;
        const clientID = ENV.STRAVA_CLIENT_ID;
        const clientSecret  = ENV.STRAVA_CLIENT_SECRET;
        const grantType = "refresh_token";

        if(!isTokenExpired(expiresAt)) return next();

        const response = await fetch("https://www.strava.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_id: clientID, client_secret: clientSecret, grant_type: grantType, refresh_token: refreshToken })
        });

        if(!response.ok) return res.redirect(`${ENV.CLIENT_URL}/profile?strava=error`);

        const responseData = await response.json();
        user.stravaAuth.accessToken = responseData.access_token;
        user.stravaAuth.expiresAt = responseData.expires_at * 1000;
        user.stravaAuth.refreshToken = responseData.refresh_token;

        await user.save();

        next();
    } catch(error) {
        console.error("Error in checkStravaToken middleware", error);
        res.status(500).json({ message: "Internal server error" });
    }
}