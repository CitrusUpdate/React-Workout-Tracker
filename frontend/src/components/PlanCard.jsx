import { useState } from 'react';
import { ChevronDown, Play, Edit } from 'lucide-react'
import { Link } from 'react-router';
import { motion, AnimatePresence } from "motion/react";

export default function PlanCard({ plan, index, userMaxes }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const planDays = plan.days;
    const trainingDays = planDays.length || 0;
    const planName = plan.name || "Training Plan";
    const planDescription = plan.description || null;
    const planType = plan.type;
    const totalExercises = planDays.reduce((sum, day) => sum + (day.exercises?.length || 0 ), 0);

    const calculateWeight = (exerciseName, percent) => {
        if (!userMaxes || !percent) return null;
        
        const max = userMaxes[exerciseName] || userMaxes[exerciseName.toLowerCase()];
        
        if (!max) return null;
        
        return (max * percent) / 100;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-slate-800/40 border border-slate-700/50 rounded-lg overflow-hidden flex flex-col"
        >
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between hover:bg-slate-800/60 transition p-4 cursor-pointer group"
            >
                <div>
                    <h3 className="text-white font-bold text-lg">{planName}</h3>
                    <p className='text-slate-300 text-sm'>{planDescription}</p>
                    <p className="text-slate-400 text-sm capitalize">
                        {planType} • {totalExercises} exercises • {trainingDays} training days
                    </p>
                </div>

                <div className={`p-2 rounded-full bg-slate-700 text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-700/50"
                    >
                        <div className="p-4 flex flex-col gap-5">
                            
                            <div className="flex flex-col gap-4">
                                {planDays.map((day, i) => (
                                    <div key={day._id || i} className="flex flex-col bg-slate-900/40 rounded-md border border-slate-700/30 overflow-hidden">
                                        
                                        <div className="flex justify-between items-center bg-slate-800/60 p-3 border-b border-slate-700/30">
                                            <span className="text-slate-200 font-bold text-sm">
                                                Day {i + 1}: {day.name}
                                            </span>
                                            <span className="text-slate-500 text-xs font-semibold">
                                                {day.exercises?.length || 0} exercises
                                            </span>
                                        </div>

                                        <div className="p-3 flex flex-col gap-3">
                                            {day.exercises?.map((exercise, j) => {
                                                const weightToLift = calculateWeight(exercise.name, exercise.targetPercent1RM);

                                                return (
                                                    <div key={exercise._id || j} className="bg-slate-800/40 p-3 rounded border border-slate-700/50">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-slate-300 text-sm font-semibold">{exercise.name}</span>
                                                            <span className="text-slate-400 text-xs font-bold">{exercise.setsCount} SETS</span>
                                                        </div>
                                                        
                                                        <div className="flex flex-wrap gap-2">
                                                            {exercise.targetRir !== null && exercise.targetRir !== undefined && (
                                                                <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                                    RIR: {exercise.targetRir}
                                                                </span>
                                                            )}
                                                            {exercise.targetPercent1RM !== null && exercise.targetPercent1RM !== undefined && (
                                                                <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                                    {exercise.targetPercent1RM}% 1RM 
                                                                    {weightToLift && ` (${weightToLift} kg)`} 
                                                                </span>
                                                            )}
                                                        </div>

                                                        {exercise.notes && (
                                                            <p className="text-slate-500 text-xs mt-2 italic">* {exercise.notes}</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div> 
                                ))}
                            </div>

                            <div className="flex gap-3 mt-2">
                                <button 
                                    className="flex-1 flex justify-center items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-md text-sm font-semibold transition cursor-pointer"
                                    onClick={() => console.log("Edit plan", plan._id)}
                                >
                                    <Edit size={16} /> Edit Plan
                                </button>

                                <button 
                                    className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md text-sm font-semibold transition cursor-pointer"
                                    onClick={() => console.log("Set active:", plan._id)}
                                >
                                    <Play size={16} /> Set as Active
                                </button>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}