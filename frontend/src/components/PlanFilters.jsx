import { Calendar, Dumbbell, Footprints, Zap, BatteryLow, BatteryMedium, BatteryFull, X, Folder } from "lucide-react";

export default function PlanFilters({ planType, setPlanType, planFrequency, setPlanFrequency, clearPlanFilters }) {
    const getBtnClass = (currentValue, targetValue) => {
        const baseClass = "w-full flex items-center gap-3 px-4 py-2 rounded-md font-medium transition cursor-pointer";
        return currentValue === targetValue
            ? `${baseClass} bg-slate-700 text-blue-400 shadow-sm` // active
            : `${baseClass} hover:bg-slate-700 text-slate-300`; // unactive
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6 h-max sticky top-28 shadow-sm shadow-blue-500/40">
            <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Filters</h2>

            <hr className="border-slate-700 mb-6" />

            <div>
                <h3 className="text-slate-400 text-sm font-semibold mb-3">Plan Type</h3>
                <div className="flex flex-col gap-2">
                    <button onClick={() => setPlanType("all")} className={getBtnClass(planType, "all")}>
                        <Folder size={18} />
                        All Types
                    </button>

                    <button onClick={() => setPlanType("strength")} className={getBtnClass(planType, "strength")}>
                        <Dumbbell size={18} className="text-indigo-400" />
                        Strength
                    </button>
                    
                    <button onClick={() => setPlanType("running")} className={getBtnClass(planType, "running")}>
                        <Footprints size={18} className="text-rose-400" />
                        Running
                    </button>

                    <button onClick={() => setPlanType("hybrid")} className={getBtnClass(planType, "hybrid")}>
                        <Zap size={18} className="text-yellow-400" />
                        Hybrid
                    </button>
                </div>
            </div>

            <hr className="border-slate-700 my-6" />
            
            <div>
                <h3 className="text-slate-400 text-sm font-semibold mb-3">Frequency</h3>
                <div className="flex flex-col gap-2">
                    <button onClick={() => setPlanFrequency("all")} className={getBtnClass(planFrequency, "all")}>
                        <Calendar size={18} />
                        Any
                    </button>

                    <button onClick={() => setPlanFrequency("low")} className={getBtnClass(planFrequency, "low")}>
                        <BatteryLow size={18} className="text-green-400" />
                        1-2 Days / week
                    </button>

                    <button onClick={() => setPlanFrequency("medium")} className={getBtnClass(planFrequency, "medium")}>
                        <BatteryMedium size={18} className="text-yellow-400" />
                        3-4 Days / week
                    </button>

                    <button onClick={() => setPlanFrequency("high")} className={getBtnClass(planFrequency, "high")}>
                        <BatteryFull size={18} className="text-red-400" />
                        5+ Days / week
                    </button>
                </div>
            </div>

            <button 
                onClick={clearPlanFilters}
                className="w-full mt-8 flex items-center justify-center gap-2 text-slate-500 hover:text-red-400 text-sm font-bold uppercase tracking-wider transition cursor-pointer"
            >
                <X size={16} />
                Clear Filters
            </button>
        </div>
    );
}