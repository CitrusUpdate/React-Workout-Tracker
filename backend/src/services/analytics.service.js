import WorkoutSession from "../models/WorkoutSession.js";
import User from "../models/User.js";
import { createNotification } from "./notification.services.js";

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

export const runProgressAnalytics = async () => {
    const users = await User.find();

    for(const user of users) {
        const goal = user.profile?.goal || "maintain";
        const weeks = WEEKS_MAP[goal];

        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - weeks * 7);

        const sessions = await WorkoutSession.find({
            owner: user._id,
            date: { $gte: sinceDate},
        }).sort({ date: 1 });

        if(!sessions.length) continue;

        const exerciseMap = new Map();

        sessions.forEach(session => {
            session.exercises.forEach(ex => {
                if(!exerciseMap.has(ex.name)) {
                    exerciseMap.set(ex.name, []);
                }

                ex.sets.forEach(set => {
                    if(set.completed && set.weight && set.reps) {
                        exerciseMap.get(ex.name).push({
                            weight: set.weight || 0,
                            reps: set.reps || 0,
                            date: session.date,
                        });
                    }
                });
            });
        });

        for(const [exerciseName, sets] of exerciseMap.entries()) {
            if(sets.length < 2) continue;

            const first = sets[0];
            const last = sets[sets.length - 1];

            const noWeightProgress = last.weight <= first.weight;
            const noRepsProgress = last.reps <= first.reps;

            if(noWeightProgress && noRepsProgress) {
                // if no progress we suggest to lower weight 10%
                const suggestionWeight = Math.round(last.weight * 0.9);

                await createNotification({
                    userId: user._id,
                    type: "progress",
                    title: `No progress: ${exerciseName}`,
                    message: `You haven't made any progress in ${weeks}. Consider a deload (-10%)`,
                    meta: {
                        exercise: exerciseName,
                        currentWeight: last.weight,
                        suggestedWeight: suggestionWeight,
                    },
                });
            }
        }
    }
};

/*
    too much reps algorithm:
    When user is doing too much reps?
        - when he's doing more than 13 reps
        - weight is probably to light so its better to increase weight and lower reps
*/

export const runHighRepsAnalysis = async() => {
    const users = await User.find();

    for(const user of users) {
        const sessions = await WorkoutSession.find({
            owner: user._id,
        }).sort({ date: -1 }).limit(5);

        for(const session of sessions) {
            for(const ex of session.exercises) {
                let notified = false;

                for(const set of ex.sets) {
                    if(!set.completed) continue;

                    if(set.reps > 13 && !notified) {
                        const newWeight = (set.weight || 0) + 2.5;

                        await createNotification({
                            userId: user._id,
                            type: "volume",
                            title: `Too many reps: ${ex.name}`,
                            message: `You did ${set.reps} reps. Consider increasing weight (+2.5kg)`,
                            meta: {
                                exercise: ex.name,
                                currentWeight: set.weight,
                                suggestedWeight: newWeight,
                            },
                        });

                        notified = true;
                    }
                }
            }
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

export const runRirAnalysis = async() => {
    const users = await User.find();

    for(const user of users) {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - 7); // last week

        const sessions = await WorkoutSession.find({
            owner: user._id,
            date: { $gte: sinceDate },
        });

        const notifiedExercises = new Set();

        for(const session of sessions) {
            for(const ex of session.exercises) {
                if(notifiedExercises.has(ex.name)) continue;

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
                if(ratio >= 0.6 && !notified) {
                    await createNotification({
                        userId: user._id,
                        type: "rir",
                        title: `Too easy ${ex.name}`,
                        message: `Most of your sets had high RIR (${highRirSets}/${totalSets}). Train closer to failure`,
                        meta: {
                            exercise: ex.name,
                            highRirSets,
                            totalSets,
                        },
                    });

                    notifiedExercises.add(ex.name);
                }
            }
        }
    }
};