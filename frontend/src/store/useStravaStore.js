import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore";

export const useStravaStore = create((set, _) => ({
    isFetchingStravaDetails: false,
    stravaUserDetails: null,
    stravaRunDetails: null,
    stravaRuns: null,
    stravaUserStats: null,

    // connect to strava
    connectStrava: async () => {
        try { 
            const res = await axiosInstance.get("/strava/connect");
            window.location.href = res.data.stravaAuthUri;
        } catch(error) {
            console.error("Error in connectStrava: ", error);
        } finally {
        }

    },

    // disconnect strava
    disconnectStrava: async () => {
        try {
            await axiosInstance.delete("/strava/disconnect");

            // download user again
            useAuthStore.getState().checkAuth();
            toast.success("Disconnected");
        } catch(error) {
            console.error("Error in disconnectStrava: ", error);
            toast.error(error.response?.data?.message || "Error while disconnecting");   
        }
    },

    // get user details
    getUserInfo: async () => {
        try {
            set({ isFetchingStravaDetails: true });
            const res = await axiosInstance.get("/strava/runs/athlete");
            set({ stravaUserDetails: res.data.userDetails });
        } catch(error) {
            console.error("Error in getUserInfo: ", error);
        } finally {
            set({ isFetchingStravaDetails: false });
        }
    },

    //get run details
    getRunDetails: async (id) => {
        try {
            set({ isFetchingStravaDetails: true });
            const res = await axiosInstance.get(`/strava/runs/${id}`);
            set({ stravaRunDetails: res.data.runDetails });
        } catch(error) {
            console.error("Error in getRunDetails: ", error);
        } finally {
            set({ isFetchingStravaDetails: false });
        }
    },

    // get run stats
    getRuns: async () => {
        try {
            set({ isFetchingStravaDetails: true });
            const res = await axiosInstance.get("/strava/runs");
            set({ stravaRuns: res.data.runs });
        } catch(error) {
            console.error("Error in getRuns: ", error);
        } finally {
            set({ isFetchingStravaDetails: false });
        }
    },
    
    getUserStats: async() => {
        try {
            set({ isFetchingStravaDetails: true });
            const res = await axiosInstance.get("/strava/runs/stats");
            set({ stravaUserStats: res.data.stravaStats });
        } catch(error) {
            console.error("Error in getUserStats: ", error);
        } finally {
            set({ isFetchingStravaDetails: false });
        }
    }
}))