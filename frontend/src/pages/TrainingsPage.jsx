import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TrainingTabSwitch from "../components/TrainingTabSwitch";
import WorkoutFilters from "../components/WorkoutFilters";
import WorkoutCardSkeleton from "../components/WorkoutCardSkeleton";
import { useWorkoutStore } from "../store/useWorkoutStore";
import { usePlanStore } from "../store/usePlanStore";
import { useAuthStore } from "../store/useAuthStore";
import { useWorkoutFilters } from "../hooks/useWorkoutFilters";
import { usePlanFilters } from "../hooks/usePlanFilters";
import WorkoutCard from "../components/WorkoutCard";
import PlanFilters from "../components/PlanFilters";
import PlanCard from "../components/PlanCard";

export default function TrainingsPage() {
    const[activeTab, setActiveTab] = useState("workouts");

    const { plans, isLoadingPlans, loadPlans } = usePlanStore();
    const { workouts, isLoadingWorkouts, fetchWorkouts } = useWorkoutStore();
    const { authUser } = useAuthStore();
    const userMaxes = authUser?.profile?.maxes || {};

    useEffect(() => {
        loadPlans();
        fetchWorkouts();
    }, []);

    const rawWorkouts = workouts?.sessions || [];
    const {
        statusFilter, setStatusFilter,
        dateRange, setDateRange,
        filteredItems, clearFilters
    } = useWorkoutFilters(rawWorkouts);

    const rawPlans = plans || [];
    const {
        planType, setPlanType,
        planFrequency, setPlanFrequency,
        filteredPlans, clearPlanFilters
    } = usePlanFilters(rawPlans);

    return (
        <div className="pt-24 min-h-screen bg-gray-950 flex flex-col md:flex-row">
            <Navbar />
            <Sidebar />

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 w-full max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-8"
            >
                
                <div className="w-full md:w-1/4">
                    {activeTab === "workouts" && (
                        <WorkoutFilters 
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            clearFilters={clearFilters}
                        />
                    )}

                    { activeTab === "plans" && (
                        <PlanFilters 
                            planType={planType}
                            setPlanType={setPlanType}
                            planFrequency={planFrequency}
                            setPlanFrequency={setPlanFrequency}
                            clearPlanFilters={clearPlanFilters}
                        />
                    )}
                </div>

                <div className="w-full md:w-3/4 flex flex-col">
                    
                    <TrainingTabSwitch activeTab={activeTab} setActiveTab={setActiveTab} />
                    
                    <h1 className="text-2xl font-bold text-white mb-6">
                        {activeTab === "plans" ? "Your Training Plans" : "Workouts History"}
                    </h1>

                    <div className="flex flex-col gap-4 mt-6">
                        { /*cards */ }
                        { activeTab === "workouts" && (
                            filteredItems.length > 0 ? (
                                filteredItems.map((workout, index) => (
                                    <WorkoutCard key={workout._id} workout={workout} index={index}/>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-slate-800/20 rounded-lg border border-dashed bordere-slate-700">
                                    <p className="text-slate-400 font-medium">No workouts found</p>
                                    <p className="text-slate-500 text-sm mt-1">Try to adjust your filters or clear them</p>
                                </div>
                            )
                        )}

                        { activeTab === "plans" && (
                            filteredPlans.length > 0 ? (
                                filteredPlans.map((plan, index) => (
                                    <PlanCard key={plan._id} plan={plan} index={index} userMaxes={userMaxes}/>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-slate-800/20 rounded-lg border border-dashed bordere-slate-700">
                                    <p className="text-slate-400 font-medium">No plans found</p>
                                    <p className="text-slate-500 text-sm mt-1">Try to adjust your filters or clear them</p>
                                </div>
                            )
                        )}
                    </div>

                </div>

            </motion.div>
        </div>
    );
}