import { Dumbbell, ArrowRight, CheckCircle, Clock} from 'lucide-react'
import { Link } from 'react-router';
import { motion } from "motion/react";

export default function WorkoutCard({ workout, index }) {
    const isCompleted = workout?.exercises?.every(ex => ex.sets?.every(set => set.completed));
    const workoutDate = new Date(workout.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const totalExercises = workout.exercises?.length || 0;
    const completedExercises = workout.exercises?.filter(ex => ex.sets?.every(set => set.completed)).length || 0;

    // if user completed all we want to go tu workout summary, if not we are going to preview
    const targetUrl = isCompleted
    ? `/trainings/summary/${workout._id}`
    : `/trainings/preview/${workout.planId}/${workout.dayIndex}`;

    const workoutName = workout.name || "Workout Session";

    return (
        <motion.div
            initial={ { opacity: 0, y: -20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={{
                duration: 0.3,
                delay: index * 0.1
            }}
        >
                <Link 
                    to={targetUrl}
                    className='flex items-center justify-between bg-slate-800/40 hover:bg-slate-800/60 transition p-4 rounded-lg border border-slate-700/50 group cursor-pointer'
                >
                    <div className='flex items-center space-x-4'>
                        <div className='flex items-center justify-center w-12 h-12 bg-slate-700 rounded-lg text-blue-400'>
                            <Dumbbell size={24} />
                        </div>

                        <div className='flex flex-col'>
                            <h3 className='text-white font-bold text-lg'>{workoutName}</h3>
                            <p className='text-slate-400 text-sm'>{workoutDate} • {completedExercises}/{totalExercises} exercises</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <div className='hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-700'>
                            { isCompleted ? (
                                <>
                                    <CheckCircle size={14} className='text-green-400' />
                                    <span className='text-green-400 text-xs font-semibold uppercase tracking-wider'>Completed</span>
                                </>
                            ) : (
                                <>
                                    <Clock size={14} className='text-yellow-400' />
                                    <span className='text-yellow-400 text-xs font-semibold uppercase tracking-wider'>Pending</span>
                                </>
                            )}
                        </div>

                        <div className='flex items-center justify-center w-10 h-10 bg-slate-700 text-slate-300 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
}