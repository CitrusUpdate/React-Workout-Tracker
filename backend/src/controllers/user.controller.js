import { calculateUserStats } from "../services/nutrition.services.js";
import User from "../models/User.js";
import TrainingPlan from "../models/TrainingPlan.js";

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
        const { weight, height, age, gender, goal, experienceLevel, preferences, maxes = {} } = req.body;
        const user = await User.findById(req.user._id);

        const validGenders = ["male", "female"];
        const validGoals = ["cut", "maintain", "bulk"];
        const validLevels = ["beginner", "intermediate", "advanced"];

        if(!user) return res.status(404).json({ message: "User not found" });


        if(gender && !validGenders.includes(gender)) return res.status(400).json({ message: "Invalid gender" });
        if(goal && !validGoals.includes(goal))  return res.status(400).json({ message: "Invalid goal" });
        if(experienceLevel && !validLevels.includes(experienceLevel))  return res.status(400).json({ message: "Invalid experience level" });

        if(weight) user.profile.weight = weight;
        if(height) user.profile.height = height;
        if(age) user.profile.age = age;
        if(gender) user.profile.gender = gender;
        if(goal) user.profile.goal = goal;

        if(experienceLevel) user.experienceLevel = experienceLevel;
        if(preferences) user.preferences  = { ...user.preferences, ...preferences };
        if(maxes) {
            if (!user.profile.maxes) {
                user.profile.maxes = new Map();
            } else {
                user.profile.maxes.clear();
            }
            
            Object.entries(maxes).forEach(( [exercise, value ] ) => {
                user.profile.maxes.set(exercise, Number(value));
            })
        }

        await user.save();

        await res.json({ message: "User profile updated succesfully" , profile: user.profile });
    } catch(error) {
        console.error("updateUserProfile", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const setAsActive = async(req, res) => {
    try {
        const { planId } = req.body;

        if(!planId) return res.status(400).json({ message: "Plan ID is required" });

        const planExists = await TrainingPlan.findById(planId);
        if(!planExists) {
            return res.status(404).json({ message: "Training plan not found" });
        }

        const user = await User.findById(req.user._id);

        user.activePlan = {
            planId: planId,
            currentWeek: 1,
            startedAt: new Date()
        };

        await user.save();

        res.status(200).json({ 
            message: "Active plan updated succesfully" ,
            activePlan: user.activePlan
        });
    } catch(error) {
        console.error("SetAsActive", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const incrementPlanWeek = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user.activePlan || !user.activePlan.planId) {
            return res.status(400).json({ message: "You don't have and active plan right now" });
        }

        user.activePlan.currentWeek += 1;
        await user.save();
        
        res.status(200).json({ 
            message: "Week incremented successfully", 
            currentWeek: user.activePlan.currentWeek 
        });
    } catch(error) {
        console.error("incrementPlanWeek", error);
        res.status(500).json({ message: "Internal server error" });
    }
}