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

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;