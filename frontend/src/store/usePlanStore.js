import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from 'react-hot-toast';

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
    },

    setAsActive: async(planID) => {
        try {
            const res = await axiosInstance.put(`/users/active-plan`, { planId: planID });
            useAuthStore.getState().checkAuth();
            toast.success("Plan has been set as active");
        } catch(error) {
            console.error("Error in setAsActive: ", error);
        }
    },

    deletePlan: async(planID) => {
        try {
            await axiosInstance.delete(`/workouts/plans/${planID}`);
            useAuthStore.getState().checkAuth();
            toast.success("Plan has been deleted successfully");

            // update plans after delete
            set((state) => ({ plans: state.plans .filter(p => p._id !== planID) }));
        } catch(error) {
            console.error("Error in deletePlan: ", error);
        }
    }
}));