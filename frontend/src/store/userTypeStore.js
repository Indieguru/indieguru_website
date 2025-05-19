import { create } from "zustand";

const useUserTypeStore = create((set) => ({
  userType: "not_signed_in", // default to not signed in
  setUserType: (type) => {
    if (["student", "expert", "not_signed_in"].includes(type)) {
      set({ userType: type });
    }
  },
  resetUserType: () => set({ userType: "not_signed_in" })
}));

export default useUserTypeStore;