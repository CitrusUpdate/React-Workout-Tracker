import { CheckCircle, Clock, Calendar, X } from "lucide-react";
import TrainingTabSwitch from "./TrainingTabSwitch";

export default function WorkoutFilters({ statusFilter, setStatusFilter, dateRange, setDateRange, clearFilters }) {
    const getBtnClass = (filterName) => {
        const baseClass = "w-full flex items-center gap-3 px-4 py-2 rounded-md font-medium transition cursor-pointer";
        return statusFilter === filterName
            ? baseClass + " bg-slate-600 text-white shadow-sm" //actve
            : baseClass + " hover:bg-slate-700 text-slate-300" // unactive
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6 h-max sticky top-28 shadow-sm shadow-blue-500/40">
            <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Filters</h2>

            <hr className="border-slate-700 mb-6" />

            <div>
                <h3 className="text-slate-400 text-sm font-semibold mb-3">Status</h3>

                <div className="flex flex-col gap-2">
                    <button onClick={() => setStatusFilter("all")} className={getBtnClass("all")}>
                        <Calendar size={18} />
                        All
                    </button>

                    <button onClick={() => setStatusFilter("completed")} className={getBtnClass("completed")}>
                        <CheckCircle size={18} className="text-green-400" />
                        Completed
                    </button>
                    
                    <button onClick={() => setStatusFilter("pending")} className={getBtnClass("pending")}>
                        <Clock size={18} className="text-yellow-400" />
                        Pending
                    </button>
                </div>
            </div>

            <hr className="border-slate-700 my-6" />
            
            <div>
                <h3 className="text-slate-400 text-sm font-semibold mb-3">Date range</h3>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <label className="text-xs text-slate-500 mb-1">From</label>
                        <input
                            type="date"
                            name="from"
                            value={dateRange.from}
                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                            className="bg-slate-700 text-slate-300 px-4 py-2 rounded-md font-medium outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer scheme-dark"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-slate-500 mb-1">To</label>
                        <input
                            type="date"
                            name="from"
                            value={dateRange.to}
                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                            className="bg-slate-700 text-slate-300 px-4 py-2 rounded-md font-medium outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer scheme-dark"
                        />
                    </div>
                </div>
            </div>

            <button 
                onClick={clearFilters}
                className="w-full mt-8 flex items-center justify-center gap-2 text-slate-500 hover:text-red-400 text-sm font-bold uppercase tracking-wider transition cursor-pointer ">
                    <X size={16} />
                    Clear Filters
            </button>
        </div>
    );
}