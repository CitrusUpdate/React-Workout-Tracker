import  { create } from 'zustand';
import { axiosInstace } from '../lib/axios';

export const useUserStore = create((set, get) => ({
    userStats: null,
    isLoadingStats: false,

    getStats: async() => {
        try{ 
            set({ isLoadingStats: true });
            const res = await axiosInstace.get("/users/stats");
            set({ userStats: res.data });
        } catch(error) {
            console.error("Error in getStats: ", error);
        } finally {
            set({ isLoadingStats: false });
        }   
}}));