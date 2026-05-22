import PageLoader from './PageLoader.jsx';
import { ArrowRight, Trophy } from 'lucide-react';
import { Link } from 'react-router';

export default function PersonalInfo({ profile }) {
    const { age, weight, height, gender, goal, maxes = {} } = profile;
    const maxesArray = Object.entries(maxes);

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-slate-800 md:divide-x text-center mb-6">
                <div className="flex flex-col">
                    <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Age</span>
                    <span className="text-xl font-bold text-white mt-1">{age}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Weight</span>
                    <span className="text-xl font-bold text-white mt-1">{weight} <span className="text-sm text-slate-500">kg</span></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Height</span>
                    <span className="text-xl font-bold text-white mt-1">{height} <span className="text-sm text-slate-500">cm</span></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Gender</span>
                    <span className="text-xl font-bold capitalize text-white mt-1">{gender}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Goal</span>
                    <span className="text-xl font-bold capitalize text-blue-400 mt-1">{goal}</span>
                </div>
            </div>

            <hr className='border-slate-800' />

            <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                    <Trophy size={18} className="text-yellow-400" />
                    <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Personal Records</h2>
                </div>

                {maxesArray.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {maxesArray.map(( [ exerciseName, weightValue ] ) => (
                            <div key={exerciseName} className="bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-3">
                                <span className="text-slate-300 font-medium text-sm">{exerciseName}</span>
                                <span className="text-white font-bold">{weightValue} <span className="text-slate-500 text-xs">kg</span></span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <p className="text-slate-500 text-sm">No personal records to show yet.</p>
                        <Link 
                            to="/settings" 
                            className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm font-semibold transition"
                        >
                            Have any maxes? Log them! <ArrowRight size={18} className="inline-block ml-1"/>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}