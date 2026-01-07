import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { ENV } from "./env.js";

// base protection - shield and bots
const baseRules = [
    shield({ mode: "LIVE" }),
    detectBot({
        mode: "LIVE",
        allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
];

// login 3 requests for 5 minutes to avoid bruteforcing
export const ajLogin = arcjet({
    key: ENV.ARCJET_KEY,
    rules: [
        ...baseRules,
        slidingWindow({
            mode: "LIVE",
            max: 3,
            interval: 300,
        }),
    ],
});

// signup 3 requests for 10 minutes
export const ajSignup = arcjet({
    key: ENV.ARCJET_KEY,
    rules: [
        ...baseRules,
        slidingWindow({
            mode: "LIVE",
            max: 3,
            interval: 600,
        }),
    ],
});

// authenticated user actions update profile, check auth etc.
export const ajAuth = arcjet({
    key: ENV.ARCJET_KEY,
    rules: [
        ...baseRules,
        slidingWindow({
            mode: "LIVE",
            max: 30,
            interval: 60
        }),
    ],
});