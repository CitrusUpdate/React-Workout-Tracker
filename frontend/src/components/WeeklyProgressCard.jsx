export default function WeeklyProgressCard({ workoutDays, completedSessions }) {
    const days = workoutDays || 0;
    const sessions = completedSessions || 0;

    return (
        <div>
            <p>
                <span className="text-white text-4xl font-bold">{sessions} / </span> 
                <span className="text-white text-4xl font-bold">{days}</span>
            </p>

            {days === 0 && sessions === 0 && (
                <p className="text-white text-sm mt-2">No data from this week</p>
            )}

            {days > 0 && days === sessions && (
                <p className="text-green-400 text-sm mt-2">
                    Congratulations! You've completed all trainings this week 
                </p>
            )}

            {days > 0 && days !== sessions && (
                <p className="text-yellow-400 text-sm mt-2">
                    Still have some trainings to do. Get to work! 
                </p>
            )}
        </div>
    );
}