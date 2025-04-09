import { create } from "zustand";
import axiosInstance from "../config/axios.config";

const useUserStore = create((set) => ({
  user: {
    firstName:"dummy"
  },
  setUser: (userData) => set({ user: userData }),
  fetchUser: async () => {
    try {
      const response = await axiosInstance.get("/user/details");
      if (response.status === 200) {
        set({ user: response.data });
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  },
}));

export default useUserStore;
