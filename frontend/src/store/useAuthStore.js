import { create } from "zustand";
import {axiosInstance} from "../lib/axios.js";
import {toast} from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,

    checkAuth: async () => {
        try{
            const res = await axiosInstance.get("/user/check");
            set({authUser: res.data});
        } catch (error) {
            console.log("Error checking auth:", error);
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
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp: false});  
        }
    }, 

    logout: () => {
        set({authUser: null});
    }
}));