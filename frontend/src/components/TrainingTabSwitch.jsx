import { Dumbbell, ListChecks } from "lucide-react";

export default function TrainingTabSwitch({ activeTab, setActiveTab }) {
    return (
        <div className="flex bg-slate-800 p-1 rounded-lg w-full mb-6">
            <button 
                onClick={() => setActiveTab("plans")}
                className={ `flex gap-2 flex-1 py-2 text-md font-semibold rounded-md transition-all duration-200 cursor-pointer
                    ${ activeTab === "plans"
                    ? "bg-slate-700 text-blue-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                    } ` }
            >
                <Dumbbell size={18} />
                Training Plans
            </button>

            <button 
                onClick={() => setActiveTab("workouts")}
                className={ `flex gap-2 flex-1 py-2 text-md font-semibold rounded-md transition-all duration-200 cursor-pointer
                    ${ activeTab === "workouts"
                    ? "bg-slate-700 text-blue-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                    } ` }
            >
                <ListChecks size={18} />
                Workouts
            </button>
        </div>
    );
}