import { useAuthStore } from "../store/useAuthStore.js";
import { CalendarX2 } from "lucide-react";
import { Link } from "react-router";

export default function NoActivePlan() {
    const { authUser } = useAuthStore();

    if(authUser?.activePlan?.planId) return null;

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-800/20 border border-dashed border-slate-700 rounded-xl text-center w-full">
            <div className="bg-slate-800 p-4 rounded-full mb-4 text-slate-400">
                <CalendarX2 size={32} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">No Active Plan</h3>

            <p>You don't have an active training plan right now. Set an existing plan as active or create a plan to see your schedule</p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link 
                    to="/trainings"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md text-sm font-semibold transition cursor-pointer"
                >
                    Select Plan
                </Link>

                <Link 
                    to="/trainings/create"
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-md text-sm font-semibold transition cursor-pointer"
                >
                    Create
                </Link>
            </div>
        </div>
    );
}