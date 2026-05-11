import { calculateUserStats } from "../services/nutrition.services.js";
import User from "../models/User.js";

export const getUserStats = async(req, res) => {
    try {
        const stats = calculateUserStats(req.user);
        if(!stats) return res.status(400).json({ message: "Fill weight, height and age first"});

        res.json(stats);
    } catch(error) {
        console.error("getUserStats", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const updateWeight = async(req, res) => {
    try {
        const { weight } = req.body;
        if(!weight) return res.status(400).json({ message: "Weight required" });
        
        const user = await User.findById(req.user._id);
        user.profile.weight = weight;

        user.weightHistory.push({
            value: weight,
            date: new Date(),
        });

        await user.save();

        res.json({ message: "Weight updated" });       
    } catch (error) {
        console.error("updateWeight", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUserProfile = async(req, res) => {
    try {
        const { weight, height, age, gender, goal, experienceLevel, preferences } = req.body;
        const user = await User.findById(req.user._id);

        if(!user) return res.status(404).json({ message: "User not found" });

        if(weight) user.profile.weight = weight;
        if(height) user.profile.height = height;
        if(age) user.profile.age = age;
        if(gender) user.profile.gender = gender;
        if(goal) user.profile.goal = goal;

        if(experienceLevel) user.experienceLevel = experienceLevel;
        if(preferences) user.preferences  = { ...user.preferences, ...preferences };

        await user.save();

        await res.json({ message: "User profile updated succesfully" , profile: user.profile });
    } catch(error) {
        console.error("updateUserProfile", error);
        res.status(500).json({ message: "Internal server error" });
    }
}