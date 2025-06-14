import { create } from "zustand";
import axiosInstance from "../config/axios.config";

const useUserStore = create((set, get) => ({
  user: {
    firstName: "dummy"
  },
  lastFetch: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes in milliseconds
  
  setUser: (userData) => set({ 
    user: userData,
    lastFetch: Date.now()
  }),
  
  fetchUser: async (forceRefresh = false) => {
    const state = get();
    const now = Date.now();
    
    // If we have cached data and it hasn't expired and we're not forcing a refresh
    if (!forceRefresh && 
        state.lastFetch && 
        now - state.lastFetch < state.cacheExpiry && 
        state.user && 
        state.user._id) {
      return state.user; // Return cached data
    }

    try {
      const response = await axiosInstance.get("/user/details");
      if (response.status === 200) {
        set({ 
          user: response.data,
          lastFetch: now
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  },

  // Force refresh user data
  refreshUser: async () => {
    return get().fetchUser(true);
  },

  // Clear user data (useful for logout)
  clearUser: () => set({ 
    user: { firstName: "dummy" },
    lastFetch: null
  })
}));

export default useUserStore;
