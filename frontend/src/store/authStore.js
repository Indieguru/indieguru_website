import { create } from "zustand";
import axiosInstance from "../config/axios.config";
import useUserTypeStore from "./userTypeStore";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (status) => set({ isAuthenticated: status }),
  fetchIsAuthenticated: async () => {
    try {
      const response = await axiosInstance.get("/user/auth/check-auth");
      if (response.status === 200) {
        set({ isAuthenticated: true });
        useUserTypeStore.getState().setUserType("student");
      }
    } catch (error) {
      set({ isAuthenticated: false });
    }
  },
  resetAuth: () => {
    set({ isAuthenticated: false });
    useUserTypeStore.getState().setUserType("not_signed_in");
  }
}));

export default useAuthStore;