import { create } from "zustand";
import axiosInstance from "../config/axios.config";
import useUserTypeStore from "./userTypeStore";

const useExpertAuthStore = create((set) => ({
  isExpertAuthenticated: false,
  loading: true,
  error: null,
  setIsExpertAuthenticated: (status) => set({ isExpertAuthenticated: status }),
  fetchIsExpertAuthenticated: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/expert/auth/check-auth");
      if (response.status === 200) {
        set({ 
          isExpertAuthenticated: true,
          loading: false,
          error: null
        });
        useUserTypeStore.getState().setUserType("expert");
        return true;
      }
    } catch (error) {
      set({ 
        isExpertAuthenticated: false,
        loading: false,
        error: error.message || "Authentication failed"
      });
      return false;
    }
  },
  resetExpertAuth: () => {
    set({ 
      isExpertAuthenticated: false,
      loading: false,
      error: null
    });
    useUserTypeStore.getState().setUserType("not_signed_in");
  }
}));

export default useExpertAuthStore;