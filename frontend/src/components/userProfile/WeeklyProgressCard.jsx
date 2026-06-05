import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Download, FileText, Table, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWorkoutStore } from "../../store/useWorkoutStore";

export default function WeeklyProgressCard({ workoutDays, completedSessions }) {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const { isExportingWorkout, exportWeeklyWorkouts } = useWorkoutStore(); 

    const days = workoutDays || 0;
    const sessions = completedSessions || 0;

    const handleExportWeek = async (format) => {
        const today = new Date();
        const dayOfWeek = today.getDay() ||7;

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
        const from = startOfWeek.toISOString().split('T')[0];

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() - dayOfWeek + 7);
        const to = endOfWeek.toISOString().split('T')[0];

        await exportWeeklyWorkouts(format, from, to);

        setIsExportModalOpen(false);
    }   

    return (
        <>
            <div className="flex flex-col justify-between h-full">
                <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Weekly progress</h2>

                <p>
                    <span className="text-white text-4xl font-bold">{sessions} / </span> 
                    <span className="text-white text-4xl font-bold">{days}</span>
                </p>

                {days === 0 && sessions === 0 && (
                    <div className="mt-4">
                        <p className="text-white text-sm mt-2">No data from this week</p>
                        <Link 
                            to="/trainings" 
                            className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm font-semibold transition"
                        >
                            Start today! <ArrowRight size={20} className="inline-block"/>
                        </Link>
                    </div>
                )}

                {days > 0 && days === sessions && (
                    <div className="mt-4">
                        <p className="text-green-400 text-sm mt-2">
                            Congratulations! You've completed all trainings this week 
                        </p>
                        <button 
                                onClick={() => setIsExportModalOpen(true)}
                                className="w-max flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md text-xs font-semibold transition cursor-pointer mt-2"
                            >
                                <Download size={14} /> Export Workouts
                            </button>
                    </div>
                )}

                {days > 0 && days !== sessions && (
                    <div className="mt-4">
                        <p className="text-yellow-400 text-sm mt-2">
                            Still have some trainings to do. Get to work! 
                        </p>
                        <Link 
                            to="/trainings" 
                            className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm font-semibold transition"
                        >
                            Start next workout <ArrowRight size={20} className="inline-block"/>
                        </Link>
                </div>
                )}
            </div>

            <AnimatePresence>
                { isExportModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExportModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-xl shadow-blue-900/10 z-10"
                        >
                            <button
                                onClick={() => setIsExportModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-lg font-bold text-white mb-2">Export weekly data</h3>
                            <p className="text-sm text-slate-400 mb-6">
                                Choose the format to download your completed workouts from this week
                            </p>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => handleExportWeek('pdf')}
                                    className="flex-1 flex flex-col items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-red-500/50 text-white p-4 rounded-lg transition cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isExportingWorkout}
                                >
                                    <FileText size={32} className="text-red-400 group-hover:scale-110 transition-transform" />
                                    <span className="font-semibold text-sm">
                                        { isExportingWorkout ? 'Downloading...' : 'Download PDF' }
                                        </span>
                                </button>

                                <button
                                    onClick={() => handleExportWeek('csv')}
                                    className="flex-1 flex flex-col items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500/50 text-white p-4 rounded-lg transition cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isExportingWorkout}
                                >
                                    <Table size={32} className="text-green-400 group-hover:scale-110 transition-transform" />
                                    <span className="font-semibold text-sm">
                                        { isExportingWorkout ? 'Downloading...' : 'Download CSV' }
                                        </span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}