import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from 'react-hot-toast';

export const usePlanStore = create((set, get) => ({
    plans: null,
    isCreatingPlan: false,
    isLoadingPlans: false,
    singlePlan: null,
    isUpdatingPlan: false,

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
            await axiosInstance.put(`/users/active-plan`, { planId: planID });
            useAuthStore.getState().checkAuth();
            toast.success("Plan has been set as active");
        } catch(error) {
            console.error("Error in setAsActive: ", error);
            toast.error(error.response?.data?.message || "Error while setting plan as active");
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
            toast.error(error.response?.data?.message || "Error while deleting plan");
        }
    },

    getSinglePlan: async(planID) => {
        try {
            set({ isLoadingPlans: true });
            const res = await axiosInstance.get(`/workouts/plans/${planID}`);
            set({ singlePlan: res.data });
        } catch(error) {
            console.error("Error in getSinglePlan: ", error);
        } finally {
            set({ isLoadingPlans: false });
        }
    },

    createPlan: async(planData) => {
        try {
            set({ isCreatingPlan: true });
            const res = await axiosInstance.post('/workouts/plans/', planData);

            set((state) => ({
                plans: state.plans ? [ res?.data, ...state.plans ] : [ res.data ]
            }));

            toast.success("Plan has been created");
            return res?.data;
        } catch(error) {
            console.error("Error in createPlan: ", error);
            toast.error(error.response?.data?.message || "Error while creating plan");
            return null;
        } finally {
            set({ isCreatingPlan: false });
        }
    },

    updatePlan: async(planID, updatedData) => {
        try {
            set({ isUpdatingPlan: true });
            const res = await axiosInstance.put(`/workouts/plans/${planID}`, updatedData);

            // update our plan
            set({ singlePlan: res.data });

            // update this plan in all plans array so we can see change without refresh in TrainingsPage component
            set((state) => ({
                plans: state.plans ? state.plans.map(p => p._id === planID ? res.data : p) : null
            })) ;
            toast.success("Plan has been updated");
        } catch(error) {
            console.error("Error in updatePlan: ", error);
            toast.error(error.response?.data?.message || "Error while updating plan");
        } finally {
            set({ isUpdatingPlan: false });
        }
    }
}));