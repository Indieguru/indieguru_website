import { create } from 'zustand';
import axiosInstance from '../config/axios.config';

const useExpertSessionsStore = create((set) => ({
  sessions: [],
  isLoading: false,
  error: null,

  fetchExpertSessions: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/expert/sessions');
      if (response.status === 200) {
        set({ 
          sessions: response.data,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch expert sessions",
        isLoading: false
      });
      console.error('Error fetching expert sessions:', error);
    }
  },

  updateSession: (sessionId, data) => set(state => ({
    sessions: state.sessions.map(session =>
      session._id === sessionId ? { ...session, ...data } : session
    )
  })),

  addSession: (session) => set(state => ({
    sessions: [...state.sessions, session]
  })),

  deleteSession: (sessionId) => set(state => ({
    sessions: state.sessions.filter(session => session._id !== sessionId)
  })),

  clearError: () => set({ error: null })
}));

export default useExpertSessionsStore;