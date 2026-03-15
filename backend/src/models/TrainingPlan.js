import mongoose, { Mongoose } from "mongoose";

const PlanExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    setsCount: { type: Number, required: true },
    targetRir: { type: Number, default: null },
    targetPercent1RM: { type: Number, default: null }, // one rep max eg. 80 means 80% of 1RM
    order: { type: Number, default: 0 },
    notes: { type: String, default: "" },
});

const PlanDaySchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    order: { type: Number, default: 0 },
    exercises: [PlanExerciseSchema]
});

const TrainingPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["strength", "running", "hybrid"], default: "strength" },
    days: [PlanDaySchema],
}, { timestamps: true });

// sort by owner ascending
TrainingPlanSchema.index({ owner: 1 });

export default mongoose.model("TrainingPlan", TrainingPlanSchema);