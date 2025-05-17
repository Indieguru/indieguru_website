import { create } from 'zustand';
import axiosInstance from '../config/axios.config';

const useExpertCohortsStore = create((set) => ({
  cohorts: [],
  isLoading: false,
  error: null,

  fetchExpertCohorts: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/expert/cohorts');
      if (response.status === 200) {
        set({ 
          cohorts: response.data,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch expert cohorts",
        isLoading: false
      });
      console.error('Error fetching expert cohorts:', error);
    }
  },

  updateCohort: (cohortId, data) => set(state => ({
    cohorts: state.cohorts.map(cohort =>
      cohort._id === cohortId ? { ...cohort, ...data } : cohort
    )
  })),

  addCohort: (cohort) => set(state => ({
    cohorts: [...state.cohorts, cohort]
  })),

  deleteCohort: (cohortId) => set(state => ({
    cohorts: state.cohorts.filter(cohort => cohort._id !== cohortId)
  })),

  clearError: () => set({ error: null })
}));

export default useExpertCohortsStore;