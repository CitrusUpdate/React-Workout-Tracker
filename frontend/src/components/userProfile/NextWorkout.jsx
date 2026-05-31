import { useNavigate} from 'react-router';
import toast from 'react-hot-toast';

export default function NextWorkout({ planId, nextDayIndex, planName, isWeekCompleted }) {
    const navigate = useNavigate();
    
    const handlePreviewClick = () => {
        if(!planId) return toast.error("No active plan found");
        navigate(`/trainings/preview/${planId}/${nextDayIndex}`);     
    }

    return (
        <div className='flex flex-col justify-between h-full'>
            <h2 className='text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2'>Next workout</h2>

            { isWeekCompleted  ? (
                <div>
                    <h3 className='text-xl font-bold text-green-400'>Everything complete!</h3>
                    <p className='text-slate-300 text-sm mt-1'>Rest for now, wait for next week</p>
                </div>
            ) : (
                <div>
                    <h3 className='text-2xl font-bold text-white mb-4'>{ planName || "Loading..." }</h3>
                    <button 
                            onClick={handlePreviewClick}
                            disabled={!planId}
                            className='bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800  disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg text-sm transition cursor-pointer w-full'
                    >
                        Preview Workout
                    </button>
                </div>
            )}
        </div>
    );
}