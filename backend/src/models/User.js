import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    fullName: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    profilePic: {
        type: String,
        default: "",
    },

    profile: {
        age: Number,
        weight: Number,
        height: Number,
        gender: {
            type: String,
            enum: ["male", "female"],
        },

        maxes: {
            type: Map,
            of: Number // { "bench press: ": 120 }
        },

        goal: {
            type: String,
            enum: ["cut", "maintain", "bulk"],
            default: "maintain",
        },
    },

    preferences: {
        units: {
            type: String,
            enum: ["kg", "lbs"],
            default: "kg",
        },

        rounding: {
            type: Number,
            default: 2.5,
        },
    },

    experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
    },

    weightHistory: [
        {
            value: Number,
            date: { type: Date, default: Date.now },
        }
    ],

    // active plan system
    activePlan: {
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingPlan",
            default: null,
        },
        // number of weeks we are using this plan
        currentWeek: {
            type: Number,
            default: 1,
        },
        // when we started this plan
        startedAt: {
            type: Date,
            default: null,
        },
    },

    // credentials to connect strava for running statistics etc.
    stravaAuth: {
        athleteId: { type: String, default: null },
        accessToken: { type: String, default: null },
        refreshToken: { type: String, default: null },
        expiresAt: { type: Date, default: null },
        // user scopes for reading activities
        scopes: { type: String, default: null },
    },

    timezone: {
        type: String,
        default: "UTC",
    },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;