import mongoose from "mongoose";

const SetSchema = mongoose.Schema({
    weight: { type: Number, required: true }, // kg
    reps: { type: Number, required: true },
    rir: { type: Number, default: null }, 
    completed: { type: Boolean, default: false },
    notes: { type: String, default: "" },
});

const ExerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    sets: [SetSchema],
    order: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    fromPlanExerciseIndex: { type: Number, default: null }, // optional pointer to plan exercise
});

const WorkoutSessionsSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingPlan", default: null },
    dayIndex: { type: Number, default: null }, // optional weekday or plan day
    type: { type: String, enum: ["strength", "running", "hybrid"], default: "strength"},
    exercises: [ExerciseSchema],
    notes: String,
}, { timestamps: true });

WorkoutSessionsSchema.index({ owner: 1, date: -1 });

export default mongoose.model("WorkoutSession", WorkoutSessionsSchema);