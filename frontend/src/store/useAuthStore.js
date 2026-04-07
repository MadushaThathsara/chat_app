import { create } from "zustand";
import {axiosInstance} from "../lib/axios.js";
import {toast} from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdating: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try{
            const res = await axiosInstance.get("/user/check");
            set({authUser: res.data});
            get().connectSocket();
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

            get().connectSocket();
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

            get().connectSocket();

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
            get().disconnectSocket();
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
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            withCredentials: true, // this ensures cookies are sent with the connection
        });

        socket.connect();

        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

}));