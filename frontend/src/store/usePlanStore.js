import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usePlanStore = create((set, get) => ({
    plans: null,
    isLoadingPlans: false,

    loadPlans: async() => {
        try {
            set({ isLoadingPlans: true });
            const res = await axiosInstance.get("/workouts/plans");
            set({ plans: res.data });
        } catch(error) {
            console.error("Error in loadPlans: ", error);
        } finally {
            set({ isLoadingPlans: false });
        }
    }
}));