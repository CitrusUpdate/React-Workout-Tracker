import { create } from 'zustand';
import { axiosInstace } from '../lib/axios.js';
import toast from 'react-hot-toast';
import axios from 'axios';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: null,
    isSigningUp: false,
    isLogginIn: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstace.get("/auth/check");
            set({ authUser: res.data });
        } catch(error) {
            console.error("Error in authCheck: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (formData) => {
        set({ isSigningUp: true });

        try {
            const res = await axiosInstace.post("/auth/signup", formData);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch(error) {
            toast.error(error.response?.data?.message || "Signing up error");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async(data) => {
        set({ isLogginIn: true });

        try {
            const res = await axiosInstace.post("/auth/login", data);
            set({ authUser: res.data });

            toast.success("Logged in succesfully");
        } catch(error) {
            toast.error(error.response?.data?.message || "Logging in error");
        } finally {
            set({ isLogginIn: false });
        }
    },

    logout: async() => {
        try{
            await axiosInstace.post("/auth/logout");
            set({ authUser: null });
            
            toast.success("Logged out succesfully");
        } catch(error) {
            toast.error("Error logging out");
            console.error("Logout error", error);
        }
    },

    updateProfile: async(data) => {
        set({ isUpdatingProfile: true });

        try {
            const res = await axiosInstace.put("/users/profile", data);
            set({ authUser: { ...get().authUser, ...res.data }});
            toast.success("Profile updated");
        } catch(error) {
            toast.error(error.response?.data?.message || "Update error");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    updateTimezone: async(timezone) => {
        try {
            await axiosInstace.patch("/auth/timezone", { timezone });
        } catch(error) {
            console.error("Timezone update error", error);
        }
    }
}));