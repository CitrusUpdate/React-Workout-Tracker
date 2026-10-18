import { ENV } from "../lib/env.js";
import User from "../models/User.js";
import { formatPace } from "../utils/strava.js";
import { epochWeekTime } from "../utils/time.js";

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
            method: "POST",
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

        return res.status(200).json({ message: "Strava disconnected successfully", stravaAuth: user.stravaAuth });
    } catch(error) {
        console.error("stravaDisconnect", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/* 
TODO: 
        get user info from strava (firstName, lastName, profilePic)
        get the user monthly running distance/weekly/all runs
*/

/* STRAVA FETCH INFO START */

export const getWeeklyStravaRuns = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const accessToken = user.stravaAuth?.accessToken;

        const [ after, before ] = epochWeekTime(); 
        const perPage = 20;

        const queryUri = `https://www.strava.com/api/v3/athlete/activities?before=${before}&after=${after}&page=1&per_page=${perPage}`;

        const response = await fetch(queryUri, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, 
            }
        });

        if(!response.ok) return res.status(502).json({ message: "Failed to fetch data from Strava" });

        const responseData = await response.json();

        const runs = responseData.filter(workout => workout.type === "Run");

        return res.status(200).json({ message: "Strava runs imported", runs });
    } catch(error) {
        console.error("getWeeklyStravaRuns", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getStravaRunDetails = async(req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(req.user._id);
        const accessToken = user.stravaAuth?.accessToken;

        const queryUri = `https://www.strava.com/api/v3/activities/${id}`;

        const response = await fetch(queryUri, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, 
            }            
        });

        if(!response.ok) return res.status(502).json({ message: "Failed to fetch data from Strava" });

        const responseData = await response.json();

        const runDetails = {
            name: responseData.name,
            distance: Number((responseData.distance / 1000).toFixed(2)),
            duration: responseData.moving_time,
            elevation: responseData.total_elevation_gain,
            avgPace: formatPace(responseData.average_speed),
            avgHeartRate: responseData.has_heartrate ? responseData.average_heartrate : null,
            splits: 
                responseData.splits_metric.map(split => ({
                    kilometer: split.split,
                    pace: formatPace(split.average_speed),
                    bpm: split.average_heartrate || null
                }))
        };

        return res.status(200).json({ message: "Strava run detail imported successfully", runDetails });
    } catch(error) {
        console.error("getStravaRunDetails", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserInfo = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const accessToken = user.stravaAuth?.accessToken;

        const response = await fetch("https://www.strava.com/api/v3/athlete", {
            method: "GET",
            headers: {
                 "Content-Type": "application/json", 
                "Authorization": `Bearer ${accessToken}` 
            }
        });

        if(!response.ok) return res.status(502).json({ message: "Failed to fetch data from Strava" });

        const responseData = await response.json();

        const userDetails = {
            username: responseData.username || "Runner",
            firstname: responseData.firstname,
            lastname: responseData.lastname,
            profilePic: responseData.profile,
            clubs: 
                responseData.clubs?.map(club => ({
                    name: club?.name
                })) || []
        };

        return res.status(200).json({ message: "User details imported successfully", userDetails });
    } catch(error) {
        console.error("getUserInfo", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getStravaStats = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const userStravaID = user.stravaAuth.athleteId;
        const accessToken = user.stravaAuth.accessToken;

        const queryUri = `https://www.strava.com/api/v3/athletes/${userStravaID}/stats`;
        const response = await fetch(queryUri, {
            method: "GET",
            headers: {
                 "Content-Type": "application/json", 
                "Authorization": `Bearer ${accessToken}` 
            }
        });

        if(!response.ok) return res.status(502).json({ message: "Failed to fetch data from Strava" });

        const responseData = await response.json();

        const stravaStats = {
            // last 4 weeks
            recentRunTotalsDistance: Number(((responseData.recent_run_totals?.distance || 0) / 1000).toFixed(2)),
            recentRunTotalsCount: responseData.recent_run_totals?.count,

            // all runs from start
            allRunTotalsDistance: Number(((responseData.all_run_totals?.distance || 0) / 1000).toFixed(2)),
            allRunTotalsCount: responseData.all_run_totals?.count,

            // all runs from year start
            ytdRunTotalsDistance: Number(((responseData.ytd_run_totals?.distance || 0) / 1000).toFixed(2)),
            ytdRunTotalsCount: responseData.ytd_run_totals?.count
        }

        return res.status(200).json({ message: "Strava stats imported successfully", stravaStats });
    } catch(error) {
        console.error("getStravaStats", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/* STRAVA FETCH INFO END */