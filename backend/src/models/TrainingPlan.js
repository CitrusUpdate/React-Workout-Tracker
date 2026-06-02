import mongoose, { Mongoose } from "mongoose";

const PlanExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    setsCount: { type: Number, required: true },
    targetRir: { type: Number },
    targetPercent1RM: { type: Number }, // one rep max eg. 80 means 80% of 1RM
    order: { type: Number, default: 0 },
    notes: { type: String, default: "" },
});

const PlanDaySchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    order: { type: Number, default: 0 },
    type: {
        type: String,
        enum: ["strength", "running"],
        default: "strength",
    },
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

// auto detect plan type
TrainingPlanSchema.pre('save', function(next) {
    const plan = this;
    if(!plan.days || plan.days.length === 0) return next();

    const dayTypes = new Set(plan.days.map(day => day.type));
    
    if(dayTypes.size > 1) {
        plan.type = "hybrid";
    } else if(dayTypes.size === 1) {
        plan.type = Array.from(dayTypes)[0];
    }

    next();
});

export default mongoose.model("TrainingPlan", TrainingPlanSchema);