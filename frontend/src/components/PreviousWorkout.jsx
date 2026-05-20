import { useNavigate} from 'react-router';
import toast from 'react-hot-toast';
import { Link } from "react-router";

export default function PreviousWorkout({ sessionId, planName }) {
    const navigate = useNavigate();
    
    const handleSummaryClick = () => {
        if(!sessionId) return toast.error("No previous workout found");
        navigate(`/trainings/summary/${sessionId}`);     
    }

    return (
        <div className='flex flex-col justify-center h-full'>
            <h2 className='text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2'>Previous workout</h2>

            { !sessionId  ? (
                <div>
                    <h3 className='text-xl font-bold text-red-400'>Not completed workout yet</h3>
                    <Link 
                        to="/trainings" 
                        className='inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm font-semibold transition'
                    >
                        Get to work! ➔
                    </Link>
                </div>
            ) : (
                <div>
                    <h3 className='text-2xl font-bold text-white mb-4'>{ planName || "Loading..." }</h3>
                    <button 
                            onClick={handleSummaryClick}
                            disabled={!sessionId}
                            className='bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800  disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg text-sm transition cursor-pointer w-full'
                    >
                        View Workout Summary
                    </button>
                </div>
            )}
        </div>
    );
}