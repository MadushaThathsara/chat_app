import { create } from "zustand";
import {axiosInstance} from "../lib/axios.js";
import {toast} from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdating: false,

    checkAuth: async () => {
        try{
            const res = await axiosInstance.get("/user/check");
            set({authUser: res.data});
        } catch (error) {
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    }, 
    
    signUp: async (formData) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/user/signup", formData);
            set({authUser: res.data});

            toast.success("Account created successfully!");

        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            set({isSigningUp: false});  
        }
    }, 

    login: async (data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/user/login", data);
            set({authUser: res.data});

            toast.success("Logged in successfully");

        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            set({isLoggingIn: false});  
        }
    }, 

    logout: async () => {
        try{
            await axiosInstance.post("/user/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed. Please try again.");
        }
    },

    updateProfile: async (data) => {  
        set({isUpdating: true});
        try {
            const res = await axiosInstance.put("/user/update-profile", data);
            set({authUser: res.data});

            toast.success("Profile updated successfully");

        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed. Please try again.");
        } finally {
            set({isUpdating: false});  
        }
    }
}));