import { Link } from "react-router";

export default function WeeklyProgressCard({ workoutDays, completedSessions }) {
    const days = workoutDays || 0;
    const sessions = completedSessions || 0;

    return (
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
                        Start today! ➔
                    </Link>
                </div>
            )}

            {days > 0 && days === sessions && (
                <div className="mt-4">
                    <p className="text-green-400 text-sm mt-2">
                        Congratulations! You've completed all trainings this week 
                    </p>
                    {/*TODO: Add an option to export all workouts from current week */}
                    <span className="inline-block mt-2 text-slate-500 text-sm font-semibold cursor-not-allowed">
                            Rest for now
                        </span>
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
                        Start next workout ➔
                    </Link>
            </div>
            )}
        </div>
    );
}