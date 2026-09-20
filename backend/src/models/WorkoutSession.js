import mongoose from "mongoose";

const SplitSchema = mongoose.Schema({
    kilometer: { type: Number },
    pace: { type: String},
    bpm: { type: Number }
}, { _id: false });

const SetSchema = mongoose.Schema({
    // strength training
    weight: { type: Number }, // kg
    reps: { type: Number },
    rir: { type: Number, default: null }, 
    tempo: { type: String, default: null },

    // running
    distance: { type: Number },
    duration: { type: Number, default: null },
    avgPace: { type: String, default: null },
    avgHeartRate: { type: Number, default: null },
    elevation: { type: Number, default: null },
    splits: [SplitSchema],
    stravaActivityId: { type: String },

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

// sort by owner ascending and by date descending
WorkoutSessionsSchema.index({ owner: 1, date: -1 });

export default mongoose.model("WorkoutSession", WorkoutSessionsSchema);