import { create } from "zustand";
import axiosInstance from "../config/axios.config";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (status) => set({ isAuthenticated: status }),
  fetchIsAuthenticated: async () => {
    try {
      const response = await axiosInstance.get("/user/auth/check-auth");
        if (response.status === 200) {
            set({ isAuthenticated: true });
        }
    } catch (error) {
      set({ isAuthenticated: false });
    }
  },
}));

export default useAuthStore;