import WorkoutSession from "../models/WorkoutSession.js";
import { canSendNotification, createNotification } from "./notification.services.js";

/* 
    check progress:
    what does it mean when user is not progressing?
        for each exercise user:
            - don't do more reps than last training
            - don't get more weight on exercise 
        during X weeks

    when user is on:
        bulk - we check 3 weeks
        maintain - 5 weeks
        cut - 7 weeks 
*/

const WEEKS_MAP = {
    bulk: 3,
    maintain: 5,
    cut: 7,
};

export const runProgressAnalyticsForUser = async (user, now) => {
    const goal = user.profile?.goal || "maintain";
    const weeks = WEEKS_MAP[goal];

    const sinceDate = new Date(now);
    sinceDate.setDate(sinceDate.getDate() - weeks * 7);

    const sessions = await WorkoutSession.find({
        owner: user._id,
        date: { $gte: sinceDate},
    }).sort({ date: 1 }).lean();

    if(!sessions.length) return;

    const exerciseMap = new Map();

    sessions.forEach(session => {
        session.exercises.forEach(ex => {
            if(!exerciseMap.has(ex.name)) {
                exerciseMap.set(ex.name, []);
            }

            ex.sets.forEach(set => {
                if(set.completed && set.weight !== null && set.reps !== null) {
                    exerciseMap.get(ex.name).push({
                        weight: set.weight || 0,
                        reps: set.reps || 0,
                        date: session.date,
                    });
                }
            });
        });
    });

    const noProgressExercises = [];

    for(const [exerciseName, sets] of exerciseMap.entries()) {
        if(sets.length < 2) continue;

        const first = sets[0];
        const last = sets[sets.length - 1];

        const noWeightProgress = last.weight <= first.weight;
        const noRepsProgress = last.reps <= first.reps;

        if(noWeightProgress && noRepsProgress) {
            noProgressExercises.push(exerciseName);    
        }
    }

    if(noProgressExercises.length) {
        const canSend = await canSendNotification({
            userId: user._id,
            type: "progress",
            sinceDate,
        });

        if(!canSend) return;

        await createNotification({
            userId: user._id,
            type: "progress",
            title: `No progress detected`,
            message: `Exercises: ${noProgressExercises.join(", ")} Consider a deload (-10%) on these exercises`,
            meta: {
                exercises: noProgressExercises,
            },
        });
    }
};

/*
    too much reps algorithm:
    When user is doing too much reps?
        - when he's doing more than 13 reps
        - weight is probably to light so its better to increase weight and lower reps
*/

export const runRepsAnalysisForUser = async(user, now) => {
    const sinceDate = new Date(now);
    sinceDate.setDate(sinceDate.getDate() - 7);

    
    const sessions = await WorkoutSession.find({
        owner: user._id,
    }).sort({ date: -1 }).limit(5).lean();

    const tooHigh = [];
    const tooLow = [];

    for(const session of sessions) {
        for(const ex of session.exercises) {
            for(const set of ex.sets) {
                if(!set.completed) continue;

                if(set.reps > 13) {
                    tooHigh.push(ex.name);
                    break;
                } else if(set.reps < 4) {
                    tooLow.push(ex.name);
                }
            }
        }
    }

    // dedupe
    const uniqueHigh = [...new Set(tooHigh)];
    const uniqueLow = [...new Set(tooLow)];

    if(uniqueHigh.length) {
        const canSend = await canSendNotification({
            userId: user._id,
            type: "volume",
            sinceDate,
        });

        if(canSend) {
            await createNotification({
                userId: user._id,
                type: "volume",
                title: "Too many reps",
                message: `Exercises: ${uniqueHigh.join(", ")}. Consider increase weight`,
                meta: {
                    exercises: uniqueHigh,
                }
            });
        }
    }   
    
    if(uniqueLow.length) {
         const canSend = await canSendNotification({
            userId: user._id,
            type: "volume",
            sinceDate,
        });

        if(canSend) {
            await createNotification({
                userId: user._id,
                type: "volume",
                title: "Too few reps",
                message: `Exercises: ${uniqueLow.join(", ")}. Consider decrease weight`,
                meta: {
                    exercises: uniqueLow,
                }
            });
        } 
    }
}; 

/*
    too far from muscle failure
    when user is doing exercises with rir (reps in reserve) 4 or 5 it means that he's:
        - too far from muscle failure
        - train too light
        - he has a lot of repetitions, he should do closer to muscle failure for better progress
*/

export const runRirAnalysisForUser = async(user, now) => {
    const sinceDate = new Date(now);
    sinceDate.setDate(sinceDate.getDate() - 7); // last week

    const sessions = await WorkoutSession.find({
        owner: user._id,
        date: { $gte: sinceDate },
    }).lean();

    const highRirExercises = []; 

    for(const session of sessions) {
        for(const ex of session.exercises) {
            let highRirSets = 0;
            let totalSets = 0;

            for(const set of ex.sets) {
                if(!set.completed) continue;

                if(set.rir != null) {
                    totalSets++;

                    if(set.rir >= 4) {
                        highRirSets++;
                    }
                }
            }

            if(totalSets === 0) continue;

            const ratio = highRirSets / totalSets;

            // if most of sets was to light
            if(ratio >= 0.6) {
                highRirExercises.push(ex.name);    
            }
        }
    }

    // dedupe
    const uniqueHighRirExercises = [...new Set(highRirExercises)];

    if(uniqueHighRirExercises.length) {
        const canSend = await canSendNotification({
            userId: user._id,
            type: "rir",
            sinceDate,
        });

        if(!canSend) return;

        await createNotification({
            userId: user._id,
            type: "rir",
            title: `Training too easy`,
            message: `Exercises: ${uniqueHighRirExercises.join(", ")}. Your sets had high RIR. Train closer to failure`,
            meta: {
                exercises: uniqueHighRirExercises,
            },
        });
    }
};

export const runWeightAnalysisForUser = async(user, now) => {
    const sinceDate = new Date(now);
    sinceDate.setDate(sinceDate.getDate() - 7);

    const history = user.weightHistory;
    if(!history || history.length < 2) return;

    const last = history[history.length - 1];
    const prev = history[history.length - 2];

    const diff = last.value - prev.value;
    const goal = user.profile?.goal || "maintain";

    const canSend = await canSendNotification({
        userId: user._id,
        type: "system",
        sinceDate,
    });

    if(!canSend) return;

    // cut
    if(goal === "cut" && diff >= 0) {
        await createNotification({
            userId: user._id,
            type: "system",
            title: "Weight not dropping",
            message: "Your weight is not decreasing. Consider lowering calories",
            meta: { diff },
        });
    }

    // bulk
    if(goal === "bulk" && diff <= 0) {
        await createNotification({
            userId: user._id,
            type: "system",
            title: "Weight not increasing",
            message: "Your weight is not increasing. Consider eating more calories.",
            meta: { diff },
        });
    }

    // maintain
    if(goal === "maintain" && Math.abs(diff) > 1) {
        await createNotification({
            userId: user._id,
            type: "system",
            title: "Weight unstable",
            message: "Your weight fluctuates too much. Adjust calories slightly",
            meta: { diff },
        });
    }

};