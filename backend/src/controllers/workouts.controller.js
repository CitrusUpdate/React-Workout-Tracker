import TrainingPlan from "../models/TrainingPlan.js";
import User from "../models/User.js";
import WorkoutSession from "../models/WorkoutSession.js";
import Papa from "papaparse";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { drawTable } from "../utils/pdfTable.js";

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

export const updatePlan = async (req, res) => {
    try {
        const plan = await TrainingPlan.findById(req.params.id);

        if(!plan) return res.status(404).json({ message: "Not found" });
        if(plan.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden"});

        Object.assign(plan, req.body);
        await plan.save();

        res.json(plan);
    } catch(error) {
        console.error("updatePlan", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deletePlan = async (req, res) => {
    try {
        const plan = await TrainingPlan.findById(req.params.id);

        if(!plan) return res.status(404).json({ message: "Not found" });
        if(plan.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        await plan.deleteOne();
        res.json({ message: "Deleted" });
    } catch(error) {
        console.error("deletePlan", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// create a workout session instance from a trainig plan
export const instantiatePlanDay = async (req, res) => {
    try {
        const plan = await TrainingPlan.findById(req.params.id);

        if(!plan) return res.status(404).json({ message: "Not found" });
        if(plan.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        const user = await User.findById(req.user._id);

        // for every exercise in plan, create new exercise in session
        const exercises = plan.exercises.map((planExercise, exerciseIndex) => ({
            name: planExercise.name, // plan name
            order: planExercise.order ?? exerciseIndex, // if the user has set the order we take it, if not we take an array order
            notes: planExercise.notes,  // plan notes
            fromPlanExerciseIndex: exerciseIndex,   // reference to the exercise position in the original training plan
            // create sets: if setsCount is 4 then it creates 4 empty sets
            sets: Array.from({ length: planExercise.setsCount }).map(() => ({
                // if plan has %1RM and user has max in his profile, then we count weight automatically, if not user can enter it manually
                weight: computeWeightFromPercent(
                    user,
                    planExercise.name,
                    planExercise.targetPercent1RM
                ),
            // user completes it after set is done: 
            reps: null,
            rir: null,
            completed: false,
            })), 
        }));

        // create session
        const session = await WorkoutSession.create({
            owner: req.user._id, // user who trains
            plan: plan._id, // plan id from where session become
            type: plan.type, // example: strength
            exercises,  // every exercise generated higher
        });

        res.status(201).json(session);
    } catch(error) {
        console.error("instantiatePlanDay", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createWorkout = async(req, res) => {
    try {
        if(!Array.isArray(req.body.exercises)) return res.status(400).json({ message: "Invalid payload"});

        const session = await WorkoutSession.create({
            owner: req.user._id,
            ...req.body,
        });

        return res.status(201).json(session);
    } catch(error) {
        console.error("createWorkout", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getWorkouts = async(req, res) => {
    try {
        // page because we want to show workouts by pages
        const page = +req.query.page || 1;
        // limit for how much records it can be at one page
        const limit = Math.min(+req.query.limit || 20, 100);
        // how much records to skip from start
        const skip = (page - 1) * limit;

        // find user sessions by the newest, with skip and limit
        const sessions = await WorkoutSession.find({ owner: req.user._id })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        res.json({ page, limit, sessions });
    } catch(error) {
        console.error("getWorkouts", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getSingleWorkout = async(req, res) => {
    try {
        const session = await WorkoutSession.findById(req.params.id);

        if(!session) return res.status(404).json({ message: "Not found" });
        if(session.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        res.json(session);
    } catch(error) {
        console.error("getSingleWorkout", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateSet = async(req, res) => {
    try {
        const { sessionID, exerciseIndex, setIndex } = req.params;
        const session = await WorkoutSession.findById(sessionID);

        if(!session) return res.status(404).json({ message: "Not found" });
        if(session.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        // take set based on parameters
        const set = session.exercises?.[exerciseIndex]?.sets?.[setIndex];
        if(!set) return res.status(404).json({ message: "Set not found" });

        // update set and save
        Object.assign(set, req.body);
        session.markModified("exercises");
        await session.save();

        res.json(session);
    } catch(error) {
        console.error("updateSet", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/*
    exports to other files
*/

export const exportPlanCsv = async(req, res) => {
    try {
        const plan = await TrainingPlan.findById(req.params.id);
        if(!plan) return res.status(404).json({ message: "Not found" });
        if(plan.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        const rows = plan.exercises.map((exercise, index) => ({
            index: index + 1,
            name: exercise.name,
            sets: exercise.setsCount,
            targetRir: exercise.targetRir,
            targetPercent1RM: exercise.targetPercent1RM,
            notes: exercise.notes || ""
        }));

        const csv = Papa.unparse(rows);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=${plan.name}.csv`);
        res.send(csv);
    } catch(error) {
        console.error("exportPlanCsv", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const exportWorkoutCsv = async(req, res) => {
    try {
        const session = await WorkoutSession.findById(req.params.id);

        if(!session) return res.status(404).json({ message: "Not found" });
        if(session.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        const rows = [];
        session.exercises.forEach(ex => {
            ex.sets.forEach((set, setIndex) => {
                rows.push({
                    exercise: ex.name,
                    exerciseNotes: ex.notes || "",
                    sets: setIndex + 1,
                    weight: set.weight,
                    reps: set.reps,
                    rir: set.rir,
                    completed: set.completed,
                    setNotes: set.notes || ""
                });
            });
        });

        const csv = Papa.unparse(rows);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=workout.csv`);
        res.send(csv);
    } catch(error) {
        console.error("exportWorkoutCsv", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const exportAllSessionsCsv = async(req, res) => {
    try {
        const sessions = await WorkoutSession.find({ owner: req.user._id }).sort({ date: 1});

        const rows = [];

        sessions.forEach(session => {
            session.exercises.forEach(ex => {
                ex.sets.forEach((set, i) => {
                    rows.push({
                        date: session.date.toISOString().split("T")[0],
                        sessionNotes: session.notes || "",
                        exercise: ex.name,
                        exerciseNotes: ex.notes || "",
                        setNumber: i + 1,
                        weight: set.weight,
                        reps: set.reps,
                        rir: set.rir,
                        completed: set.completed,
                        setNotes: set.notes || ""
                    });
                });
            });
        });

        const csv = Papa.unparse(rows);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=all-sessions.csv");
        res.send(csv);
    } catch(error) {
        console.error("exportAllSessionsCsv", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const exportPlanPdf = async(req, res) => {
    try {
        const plan = await TrainingPlan.findById(req.params.id);

        if(!plan) return res.status(404).json({ message: "Not found"});
        if(plan.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        let page = pdfDoc.addPage();

        const headers = [
            "#",
            "Exercise",
            "Sets",
            "Target RIR",
            "%1RM",
            "Notes"
        ];

        const rows = plan.exercises.map((ex, i) => [
            i + 1,
            ex.name,
            ex.setsCount,
            ex.targetRir,
            ex.targetPercent1RM,
            ex.notes || ""
        ]);

        page = drawTable({
            pdfDoc,
            page,
            headers,
            rows,
            font,
            title: `Training Plan: ${plan.name}`,
            meta: [
                `Type ${plan.type}`,
                `Exercises: ${plan.exercises.length}`
            ]
        });

        const pdfBytes = await pdfDoc.save();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${plan.name}.pdf`);
        res.send(Buffer.from(pdfBytes));
    } catch(error) {
        console.error("exportPlanPdf", error);
        res.status(500).json({ message: "Internal server error "});
    }
}

export const exportWorkoutPdf = async(req, res) => {
    try {
        const session = await WorkoutSession.findById(req.params.id);
        if(!session) return res.status(404).json({ message: "Not found" });
        if(session.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        let page = pdfDoc.addPage();

        const headers = [
            "Exercise",
            "Set",
            "Weight",
            "Reps",
            "RIR",
            "Completed",
            "Notes"
        ];

        const rows = [];

        session.exercises.forEach(ex => {
            ex.sets.forEach((set, i) => {
                rows.push([
                    ex.name,
                    i + 1,
                    set.weight,
                    set.reps,
                    set.rir,
                    set.completed ? "Yes" : "No",
                    set.notes || ""
                ]);
            });
        });

        page = drawTable({
            pdfDoc,
            page,
            headers,
            rows,
            font,
            title: `Workout ${session.date.toISOString().split("T")[0]}`,
            meta: [
                `Type: ${session.type}`,
                `Exercises: ${session.exercises.length}`,
                `Notes: ${session.notes || "-"}`
            ]
        });

        const pdfBytes = await pdfDoc.save();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=workout.pdf");
        res.send(Buffer.from(pdfBytes));
    } catch(error) {
        console.error("exportWorkoutPdf", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const exportAllSessionsPdf = async(req, res) => {
    try {
        const session = await WorkoutSession.find({ owner: req.user._id }.sort({ date: 1 }));
        if(!session) return res.status(404).json({ message: "Not found" });
        if(session.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.StandardFonts.Helvetica);

        let page = pdfDoc.addPage();

        const headers = [
            "Date",
            "Exercise",
            "Set",
            "Weight",
            "Reps",
            "RIR",
            "Completed",
            "Notes"
        ];

        const rows = [];

        session.exercises.forEach(ex => {
            ex.sets.forEach((set, i) => {
                rows.push([
                    session.date,
                    ex.name,
                    i + 1,
                    set.weight,
                    set.reps,
                    set.rir,
                    set.completed ? "Yes" : "No",
                    set.notes || ""
                ]);
            });
        });

        page = drawTable({
            pdfDoc,
            page,
            headers,
            rows,
            font,
            title: `Workout ${session.date.toISOString().split("T")[0]}`,
            meta: [
                `Type: ${session.type}`,
                `Exercises: ${session.exercises.length}`,
                `Notes: ${session.notes || "-"}`
            ]
        });

        const pdfBytes = await pdfDoc.save();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=workout.pdf");
        res.send(Buffer.from(pdfBytes));
    } catch(error) {
        console.error("exportWorkoutPdf", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const importPlanCsv = async(req, res) => {
    try {
        if(!req.file) return res.status(400).json({ message: "CSV file required" });

        const csvString = req.file.buffer.toString();

        const { data, errors } = Papa.parse(csvString, {
            header: true,
            skipEmptyLines: true,
        });

        if(errors.length) return res.status(400).json({ message: "CSV parse error", errors });

        const exercises = data.map((row, index) => ({
            name: row.name,
            order: index,
            setsCount: Number(row.sets) || 0,
            targetRir: row.targetRir ? Number(row.targetRir) : null,
            targetPercent1RM: row.targetPercent1RM ? Number(row.targetPercent1RM) : null,
            notes: row.notes || "",
        }));

        const plan = await TrainingPlan.create({
            name: req.body.name || "Imported Plan",
            owner: req.user._id,
            exercises,
        });

        res.status(201).json(plan);
    } catch(error) {
        console.error("importPlanCsv", error);
        res.status(500).json({ message: "Internal server error" });
    }
}