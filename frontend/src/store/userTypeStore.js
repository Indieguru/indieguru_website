import { create } from "zustand";

const useUserTypeStore = create((set) => ({
  userType: "student", // default value
  setUserType: (type) => set({ userType: type }),
}));

export default useUserTypeStore;