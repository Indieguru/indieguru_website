import { create } from "zustand";

const useUserTypeStore = create((set) => ({
  userType: "not_signed_in", // default value
  setUserType: (type) => set({ userType: type }),
}));

export default useUserTypeStore;