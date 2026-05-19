import { create } from "zustand";
import { axiosInstace } from "../lib/axios";

export const usePlanStore = create((set, get) => ({
    plans: null,
    isLoadingPlans: false,

    loadPlans: async() => {
        try {
            set({ isLoadingPlans: true });
            const res = await axiosInstace.get("/workouts/plans");
            set({ plans: res.data });
        } catch(error) {
            console.error("Error in loadPlans: ", error);
        } finally {
            set({ isLoadingPlans: false });
        }
    }
}));