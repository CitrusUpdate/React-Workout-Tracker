import { create } from 'zustand';
import { axiosInstace } from '../lib/axios';

export const useWorkoutStore = create((set, get) => ({
    workouts: null,
    isLoadingWorkouts: false,
    isExportingWorkout: false,

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
    },

    instantiateWorkout: async(planId, dayIndex ) => {
        try {
            const res = await axiosInstace.post(`/workouts/plans/${planId}/days/${dayIndex}/instantiate`);
            return res.data._id;
        } catch(error) {
            console.error("Error in instantiateWorkout: ", error);
            throw error;
        }
    },

    exportWeeklyWorkouts: async (format, from, to) => {
        try {
            set({ isExportingWorkout: true });

            const res = await axiosInstace.get(`/workouts/workouts/export/all/${format}?from=${from}&to=${to}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(res.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `weekly-export-${from}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch(error) {
            console.error("Error in exportWeeklyWorkouts: ", error);
            throw error;
        } finally { 
            set({ isExportingWorkout: false });
        }
    }
}));