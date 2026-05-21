import { ArrowUp, ArrowDown } from 'lucide-react';

export default function WeightHistory({ goal, weightHistory }) {
    if(!weightHistory || weightHistory.length < 2) {
        return (
            <div className="flex flex-col justify-between h-full">
                <div>
                    <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Weight History</h2>
                    <p className="text-slate-500 text-xs italic leading-relaxed">*Compared to your first recorded weight</p>
                </div>
                <div className="mt-4">
                    <p className="text-slate-400">Not enough data. Log your weight!</p>
                </div>
            </div>
        );
    }

    const sortedHistory = [...weightHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstWeight = sortedHistory[0].value;
    const currentWeight = sortedHistory[sortedHistory.length - 1].value;

    const diff = currentWeight - firstWeight;
    const percentageDiff = Math.abs((diff / firstWeight) * 100).toFixed(1);

    let colorClass = "text-slate-400";
    let arrow = <ArrowDown />

    if(diff < 0) {
        arrow = <ArrowDown />
        colorClass = goal === "cut" ? "text-green-400" : "text-red-400";
    } else if(diff > 0) {
        arrow = <ArrowUp />
        colorClass= goal === "bulk" ? "text-green-400" : "text-red-400";
    }

    if(goal === "maintain" && diff !== 0) {
        colorClass = "text-yellow-400";
    }

    return (
        <div className='flex flex-col justify-between h-full'>
            <div>
                <h2 className='text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2'>Weight history</h2>
                <p className='text-slate-500 text-xs italic leading-relaxed'>*Compared to your first recorded weight</p>
            </div>

            <div className='mt-4 flex items-end justify-between'>
                <div>
                    <p className='text-3xl font-bold text-white'>{currentWeight}<span className='text-slate-500 text-sm'>kg</span></p>
                    <p className='text-xl font-bold text-slate-400 mt-1'>Started at: {firstWeight}<span className='text-slate-500 text-sm'>kg</span></p>
                </div>

                <div className={`flex items-center gap-1 text-lg font-bold ${colorClass}`}>
                    {arrow}
                    <span>{percentageDiff}</span>
                </div>
            </div>
        </div>
    );
}