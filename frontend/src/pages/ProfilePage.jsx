import { use, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useWorkoutStore } from "../store/useWorkoutStore";
import { usePlanStore } from "../store/usePlanStore";
import { useAuthStore } from "../store/useAuthStore";
import { Settings } from 'lucide-react';
import { Link } from "react-router";
import WeeklyProgressCard from "../components/WeeklyProgressCard";
import NextWorkout from "../components/NextWorkout";
import PreviousWorkout from "../components/PreviousWorkout";

export default function ProfilePage() {
    const { fetchWorkouts, workouts, isLoadingWorkouts } = useWorkoutStore();
    const { authUser } = useAuthStore();
    const { loadPlans, plans } = usePlanStore();
    const avatarSrc = authUser.profilePic || "/default.png";

    useEffect(() => {
        fetchWorkouts();
        loadPlans();
    }, []);

    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; 
    startOfWeek.setDate(now.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);
    

    const totalSessionsInPlan = plans?.[0]?.days?.length || 0;

    const thisWeekSessions = workouts?.sessions?.filter(session => {
        const sessionDate = new Date(session.date);
        
        if (sessionDate > now) return false; 

        return sessionDate >= startOfWeek;
    }) || [];

    const completedThisWeek = thisWeekSessions.filter(session => {
        return session.exercises?.every(exercise =>
            exercise.sets?.every(set => set.completed)
        );
    });

    const completedSessions = completedThisWeek.length;
    const nextDayIndex = completedSessions;

    const isWeekCompleted = totalSessionsInPlan > 0 && nextDayIndex >= totalSessionsInPlan;
    const planNameNext = !isWeekCompleted ? plans?.[0]?.days[nextDayIndex]?.name : null;
    const planId = plans?.[0]?._id;

    const lastCompletedSession = workouts?.sessions?.find(session => {
        if(!session.exercises || session.exercises.length === 0) return false;

        return session.exercises.every(exercise => 
            exercise?.sets.every(set => set.completed)
        );
    });

    const previousSessionId = lastCompletedSession?._id || null;
    const planNamePrev = lastCompletedSession && plans?.[0] 
        ? plans[0].days[lastCompletedSession.dayIndex]?.name
        : null;

    {/*TODO: Add to User model active plan and store it with current active plan id. Now we have only one plan but we should support multiple plans choice*/}

        return (
            <div className="pt-24">
                <Navbar />
                <Sidebar />

                {/*profilePage header*/}
                <div className="flex items-center gap-8 bg-slate-800 w-full h-24 p-4 rounded-lg">
                    <img src={avatarSrc} alt="User avatar" className="md:w-12 md:h-12 w-10 h-10 rounded-full object-cover" />
                    <p className="text-white font-bold md:text-xl text-lg">{authUser.fullName}</p>
                    <Link to={"/settings"} className="ml-auto"><Settings size={36} /></Link>
                </div>

                {/*grid cards with info*/}
                <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-950">
                    <div className="w-full max-w-4xl">
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                            <div className="card">
                                <WeeklyProgressCard
                                    workoutDays={totalSessionsInPlan || 0}
                                    completedSessions={completedSessions || 0}
                                />
                            </div>
                            <div className="card">bmi</div>
                            <div className="card"><NextWorkout planId={planId} nextDayIndex={nextDayIndex}  planName={planNameNext} isWeekCompleted={isWeekCompleted}/></div>
                            <div className="card">weight history</div>
                            <div className="card"><PreviousWorkout sessionId={previousSessionId} planName={planNamePrev} /></div>
                            <div className="card">Recommended macros</div>
                        </div>
                    </div>
                </div>
            </div>
        );
}