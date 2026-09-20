import TrainingPlan from "../models/TrainingPlan.js";
import User from "../models/User.js";
import WorkoutSession from "../models/WorkoutSession.js";
import Papa from "papaparse";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { drawTable } from "../utils/pdfTable.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import { buildSessionQuery } from "../utils/query.js";
import { computeWeightFromPercent } from "../utils/weights.js";
import { generateCsvForSessions, generatePdfForSessions } from "../utils/exports.js";
import { parsePlanCsv } from "../utils/imports.js";
import { formatSecondsToTime } from "../utils/time.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontPath = path.join(__dirname, "../fonts/NotoSans-Regular.ttf");

export const createPlan = async (req, res) => {
    try {
        const { name, description, type = "strength", days = [] } = req.body;
        if(!name) return res.status(400).json({ message: "Name is required" });

        const plan = await TrainingPlan.create({
            name,
            description,
            type,
            owner: req.user._id,
            days
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
        if(req.body.days && !Array.isArray(req.body.days)) return res.status(400).json({ message: "Days must be array" });

        const allowedFields = ["name", "description", "type", "days"];
        allowedFields.forEach(field => {
            if(req.body[field] !== undefined) {
                plan[field] = req.body[field];
            }
        })

        // Object.assign(plan, req.body);
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
        const { id, dayIndex } = req.params;

        const plan = await TrainingPlan.findById(id);

        if(!plan) return res.status(404).json({ message: "Not found" });
        if(plan.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        const day = plan.days?.[dayIndex];
        if(!day) return res.status(404).json({ message: "Plan day not found" });

        const dayType = day.type || "strength";
        const user = await User.findById(req.user._id);

        // for every exercise in plan, create new exercise in session
        const exercises = day.exercises.map((planExercise, exerciseIndex) => {
            const setsCount = planExercise.setsCount || 1;

            return {
            name: planExercise.name, // plan name
            order: planExercise.order ?? exerciseIndex, // if the user has set the order we take it, if not we take an array order
            notes: planExercise.notes,  // plan notes
            fromPlanExerciseIndex: exerciseIndex,   // reference to the exercise position in the original training plan
            // create sets: if setsCount is 4 then it creates 4 empty sets
            sets: Array.from({ length: setsCount }).map(() => {
                const baseSet = {
                    completed: false,
                    notes: ""
                };

                if(dayType === "running") {
                    return {
                        ...baseSet,
                        distance: planExercise.distance || null,
                        duration: planExercise.duration || null
                    };
                } else {
                    return {
                        ...baseSet,
                        // if plan has %1RM and user has max in his profile, then we count weight automatically, if not user can enter it manually
                        weight: computeWeightFromPercent(
                            user,
                            planExercise.name,
                            planExercise.targetPercent1RM
                        ),
                        // user completes it after set is done: 
                        reps: null,
                        rir: planExercise.targetRir || null
                    };
                }
            }),
        };
        });

        // create session
        const session = await WorkoutSession.create({
            owner: req.user._id, // user who trains
            plan: plan._id, // plan id from where session become
            dayIndex: Number(dayIndex),
            type: dayType, // example: strength
            exercises // every exercise generated higher
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

        const { exercises, notes, type, date, dayIndex, plan } = req.body;
        
        const session = await WorkoutSession.create({
            owner: req.user._id,
            exercises,
            notes,
            type, 
            date,
            dayIndex,
            plan
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
        const { weight, reps, rir, completed, notes, distance, duration, pace, avgHeartRate, splits } = req.body;
        const update = {};

        if(weight !== undefined) update.weight = weight;
        if(reps !== undefined) update.reps = reps;
        if(rir !== undefined) update.rir = rir;
        if(completed !== undefined) update.completed = completed;
        if(notes !== undefined) update.notes = notes;

        if(distance !== undefined) update.distance = distance;
        if(duration !== undefined) update.duration = duration;
        if(pace !== undefined) update.pace = pace;
        if(avgHeartRate !== undefined) update.avgHeartRate = avgHeartRate;

        if(splits !== undefined) update.splits = splits;

        const session = await WorkoutSession.findById(sessionID);

        if(!session) return res.status(404).json({ message: "Not found" });
        if(session.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        // take set based on parameters
        const set = session.exercises?.[exerciseIndex]?.sets?.[setIndex];
        if(!set) return res.status(404).json({ message: "Set not found" });

        // update set and save
        Object.assign(set, update);
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

        let finalCsv = `=== Training Plan ${plan.name} ===\n`;
        if(plan.description) finalCsv += `Description: ${plan.description}\n`;

        plan.days.forEach((day, index) => {
            const dayType = day.type || "strength";
            if(index > 0) finalCsv += "\n\n";
            finalCsv += `--- Day ${index + 1}: ${day.name} | Type: ${day.type.toUpperCase()} ---\n`;
            
            const rows = [];
            day.exercises.forEach((exercise, index) => {
                if(dayType  === "running") {
                    rows.push({
                        "Order": index+ 1,
                        "Exercise": exercise.name,
                        "Distance": exercise.distance || "N/A",
                        "Duration": formatSecondsToTime(exercise.duration),
                        "Target Pace": formatSecondsToTime(exercise.targetPace),
                        "Target BPM": exercise.targetBPM || "N/A",
                        "Notes": exercise.notes || "Not provided"
                    });
                } else {
                    rows.push({
                        "Order": index + 1,
                        "Exercise": exercise.name,
                        "Sets": exercise.setsCount || "N/A",
                        "Target RIR": exercise.targetRir ?? "N/A",
                        "%1RM": exercise.targetPercent1RM ? `${exercise.targetPercent1RM}%` : "N/A",
                        "Target Tempo": exercise.targetTempo || "N/A",
                        "Notes": exercise.notes || "Not provided"
                    });
                }
            });

            if(rows.length > 0) {
                finalCsv += Papa.unparse(rows) + "\n";
            }
        });

        const encodedFilename = encodeURIComponent(`${plan.name}.csv`);

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="export.csv"; filename*=UTF-8''${encodedFilename}`);
        res.send("\uFEFF" + finalCsv);
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

        const csvString = generateCsvForSessions([session]);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=workout.csv`);
        res.send(csvString);
    } catch(error) {
        console.error("exportWorkoutCsv", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const exportAllSessionsCsv = async(req, res) => {
    try {
        const query = buildSessionQuery(req);
        const sessions = await WorkoutSession.find(query).sort({ date: 1});

       const csvString = generateCsvForSessions(sessions);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=all-sessions.csv");
        res.send(csvString);
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
        pdfDoc.registerFontkit(fontkit);
        const fontBytes = readFileSync(fontPath);
        const font = await pdfDoc.embedFont(fontBytes);

        plan.days.forEach((day, index) => {
            let page = pdfDoc.addPage();
            const dayType = day.type || "strength";

            let headers = [];
            if(dayType === "running") {
                headers = [" # ", "Exercise", "Dist.", "Dur.", "Pace", "BPM", "Notes"];
            } else {
                headers = [" # ", "Exercise", "Sets", "RIR", "%1RM", "Tempo", "Notes"];
            }

            const rows = [];
            day.exercises.forEach((ex, i) => {
                if(dayType === "running") {
                    rows.push([
                        `${i + 1}`,
                        ex.name,
                        ex.distance ? `${ex.distance} km` : "N/A",
                        ex.duration ? `${formatSecondsToTime(ex.duration)}` : "N/A",
                        ex.targetPace ? `${formatSecondsToTime(ex.targetPace)}` : "N/A",
                        ex.targetBPM ? `${ex.targetBPM}` : "N/A",
                        ex.notes || "Not provided"
                    ]);
                } else {
                    rows.push([
                        `${i + 1}`,
                        ex.name,
                        ex.setsCount || "N/A",
                        ex.targetRir ?? "N/A",
                        ex.targetPercent1RM ? `${ex.targetPercent1RM}%` : "N/A",
                        ex.targetTempo || "N/A",
                        ex.notes || "Not provided"
                    ]);
                }
            });

            drawTable({
                pdfDoc,
                page,
                headers,
                rows,
                font,
                title: `Plan: ${plan.name} | Day: ${day.name} (${dayType.toUpperCase()})`,
                meta: [
                    `Description: ${plan.description || "-"}`,
                ]
            });
        });

        const pdfBytes = await pdfDoc.save();
        const encodedFilename = encodeURIComponent(`${plan.name}.pdf`);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="export.pdf"; filename*=UTF-8''${encodedFilename}`);
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

        const pdfBuffer = await generatePdfForSessions([session]);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="workout.pdf"; filename*=UTF-8''${encodeURIComponent("workout.pdf")}`);
        res.send(pdfBuffer);
    } catch(error) {
        console.error("exportWorkoutPdf", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const exportAllSessionsPdf = async(req, res) => {
    try {
        const query = buildSessionQuery(req);
        const sessions = await WorkoutSession
            .find(query)
            .sort({ date: 1 });

        const pdfBuffer = await generatePdfForSessions(sessions);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=workout.pdf");
        res.send(pdfBuffer);
    } catch(error) {
        console.error("exportAllSessionsPdf", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const importPlanCsv = async(req, res) => {
    try {
        if(!req.file) return res.status(400).json({ message: "CSV file required" });

        const csvString = req.file.buffer.toString();

        const days = parsePlanCsv(csvString);

        if(days.length === 0) {
            return res.status(400).json({ message: "No valid training days found in CSV" });
        }

        const plan = await TrainingPlan.create({
            name: req.body.name || "Imported Plan",
            owner: req.user._id,
            days
        });

        res.status(201).json(plan);
    } catch(error) {
        console.error("importPlanCsv", error);
        res.status(500).json({ message: "Internal server error" });
    }
}