import TrainingPlan from "../models/TrainingPlan.js";

// round weight for real plates
const roundToPlate = (kg, rounding = 2.5) => Math.round(kg / rounding) * rounding;

// check if there is a percent for one rep max (1RM) then count percent from 1RM round it to gym plates
const computeWeightFromPercent = (user, exerciseName, percent) => {
    if(!percent) return null;

    const oneRM = user.profile?.maxes?.get(exerciseName) ?? user.profile?.maxes?.get(exerciseName.toLowerCase()) ?? null;

    if(!oneRM) return null;

    const rounding = user.preferences?.rounding ?? 2.5;
    return roundToPlate((oneRM * percent) / 100, rounding);
};

export const createPlan = async (req, res) => {
    try {
        const { name, description, type = "strength", exercises = [] } = req.body;
        if(!name) return res.status(400).json({ message: "Name is required" });

        const plan = await TrainingPlan.create({
            name,
            description,
            type,
            owner: req.user._id,
            exercises,
        });

        res.status(201).json(plan);

    } catch(error) {
        console.error("createPlan", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getPlans = async (req, res) => {
    try {
        const plans = await TrainingPlan.find({ owner: req.user._id }).sort({ createdAt: -1 }) //newest first

        res.json(plans);
    } catch(error) {
        console.error("getPlans", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getSinglePlan = async (req, res) => {
    try {   
        const plan = await TrainingPlan.findById(req.params.id)
        if(!plan) return res.status(404).json({ message: "Plan not found" });
        if(plan.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden"});

        res.json(plan);
    } catch(error) {
        console.error("getSinglePlan", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}