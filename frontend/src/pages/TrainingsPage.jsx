import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TrainingTabSwitch from "../components/TrainingTabSwitch";
import WorkoutFilters from "../components/WorkoutFilters";
import WorkoutCardSkeleton from "../components/WorkoutCardSkeleton";
import { useWorkoutStore } from "../store/useWorkoutStore";
import { usePlanStore } from "../store/usePlanStore";
import { useWorkoutFilters } from "../hooks/useWorkoutFilters";

export default function TrainingsPage() {
    const[activeTab, setActiveTab] = useState("workouts");

    const { plans, isLoadingPlans, loadPlans } = usePlanStore();
    const { workouts, isLoadingWorkouts, fetchWorkouts } = useWorkoutStore();

    useEffect(() => {
        loadPlans();
        fetchWorkouts();
    }, []);

    const rawWorkouts = workouts?.sessions || [];

    const {
        statusFilter, setStatusFilter,
        dateRange, setDateRange,
        filteredItems, clearFilters
    } = useWorkoutFilters();

    return (
        <div className="pt-24 min-h-screen bg-gray-950 flex flex-col md:flex-row">
            <Navbar />
            <Sidebar />

            <div className="flex-1 w-full max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-8">
                
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
                </div>

                <div className="w-full md:w-3/4 flex flex-col">
                    
                    <TrainingTabSwitch activeTab={activeTab} setActiveTab={setActiveTab} />
                    
                    <h1 className="text-2xl font-bold text-white mb-6">
                        {activeTab === "plans" ? "Your Training Plans" : "Workouts History"}
                    </h1>

                    <div className="flex flex-col gap-4">
                        { /*cards */ }
                    </div>

                </div>

            </div>
        </div>
    );
}