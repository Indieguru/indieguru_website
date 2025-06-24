import { create } from "zustand";

const useRedirectStore = create((set) => ({
  redirectUrl: null,
  setRedirectUrl: (url) => set({ redirectUrl: url }),
  clearRedirectUrl: () => set({ redirectUrl: null }),
}));

export default useRedirectStore;