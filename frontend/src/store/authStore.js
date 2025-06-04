import { create } from "zustand";
import axiosInstance from "../config/axios.config";
import useUserTypeStore from "./userTypeStore";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (status) => set({ isAuthenticated: status }),
  fetchIsAuthenticated: async () => {
    try {
      // Try user auth first
      const userResponse = await axiosInstance.get("/user/auth/check-auth");
      if (userResponse.status === 200) {
        set({ isAuthenticated: true });
        useUserTypeStore.getState().setUserType("student");
        return;
      }
    } catch (error) {
      // Don't set isAuthenticated false yet, try expert auth first
      console.log("User auth check failed, trying expert auth");
    }

    try {
      // Try expert auth if user auth failed
      const expertResponse = await axiosInstance.get("/expert/auth/check-auth");
      if (expertResponse.status === 200) {
        set({ isAuthenticated: true });
        useUserTypeStore.getState().setUserType("expert");
        return;
      }
    } catch (error) {
      console.log("Expert auth check failed");
    }

    // If both checks fail, then set as not authenticated
    set({ isAuthenticated: false });
    useUserTypeStore.getState().setUserType("not_signed_in");
  },
}));

export default useAuthStore;