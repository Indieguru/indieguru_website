import { create } from "zustand";

const useUserTypeStore = create((set) => ({
  userType: "student", // default to student instead of "not_signed_in"
  setUserType: (type) => set({ userType: type }),
}));

export default useUserTypeStore;