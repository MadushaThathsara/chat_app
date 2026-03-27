import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    
    // Actions
    setUser: (user) => set({ user, isAuthenticated: true }),
    setToken: (token) => set({ token, isAuthenticated: true }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));