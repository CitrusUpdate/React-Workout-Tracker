import { ENV } from "../lib/env.js";
import User from "../models/User.js";

/* STRAVA CONNECTION START */
export const getStravaAuthUrl = async (req, res) => {
    // generator strava auth link
    try {
        const clientID= ENV.STRAVA_CLIENT_ID;
        const redirectUri = ENV.STRAVA_REDIRECT_URI;
        const responseType = "code";
        const approvalPrompt  = "auto";
        const scope = "activity:read_all";
        const state  = req.user._id.toString();

        const stravaAuthUri = `https://www.strava.com/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=${responseType}&approval_prompt=${approvalPrompt}&scope=${scope}&state=${state}`;

        res.status(200).json({ stravaAuthUri });
    } catch(error) {
        console.error("Error in getStravaAuthUrl", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const stravaTokenExchange = async(req, res) => {
    try {
        const { code, state, scope, error } = req.query;
        const clientID = ENV.STRAVA_CLIENT_ID;
        const clientSecret = ENV.STRAVA_CLIENT_SECRET;
        const grantType = "authorization_code";

        if(error || !code ) return res.redirect(`${ENV.CLIENT_URL}/profile?strava=error`);

        const response = await fetch("https://www.strava.com/oauth/token", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_id: clientID, client_secret: clientSecret, code, grant_type: grantType })
        });

        if(!response.ok) return res.redirect(`${ENV.CLIENT_URL}/profile?strava=error`);

        const responseData = await response.json();
        await User.findByIdAndUpdate(state, {
            "stravaAuth.athleteId": responseData.athlete.id,
            "stravaAuth.accessToken": responseData.access_token,
            "stravaAuth.refreshToken": responseData.refresh_token,
            "stravaAuth.expiresAt": responseData.expires_at * 1000,
            "stravaAuth.scopes": responseData.scope || scope
        });

        return res.redirect(`${ENV.CLIENT_URL}/profile?strava=connected`);
    } catch(error) {
        console.error("stravaTokenExchange", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/* STRAVA CONNECTION END */

// STRAVA DISCONNECT
export const stravaDisconnect = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user.stravaAuth?.accessToken) return res.status(400).json({ message: "Strava account not connected" });

        const token = user.stravaAuth?.accessToken;

        await fetch("https://www.strava.com/oauth/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: token })
        });

        user.stravaAuth = { athleteId: null, accessToken: null, refreshToken: null, expiresAt: null, scopes: null };
        await user.save();

        return res.status(200).json({ message: "Strava disconnected successfully", user });
    } catch(error) {
        console.error("stravaDisconnect", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/* 
TODO: 
        get all running activities from strava, 
        get one running activity details from strava
        get user info from strava (firstName, lastName, profilePic)
        get the user monthly running distance/weekly/all runs
*/