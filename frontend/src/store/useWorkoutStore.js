import { create } from 'zustand';
import { axiosInstace } from '../lib/axios';

export const useWorkoutStore = create((set, get) => ({
    workouts: null,
    isLoadingWorkouts: false,

    fetchWorkouts: async() => {
        try {
            set({ isLoadingWorkouts: true });
            const res = await axiosInstace.get("/workouts/workouts");
            set({ workouts: res.data });
        } catch(error) {
            console.error("Error in fetchWorkouts: ", error);
            set({ workouts: null });
        } finally {
            set({ isLoadingWorkouts: false });
        }
    }
}));