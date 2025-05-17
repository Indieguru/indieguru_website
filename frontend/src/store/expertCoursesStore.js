import { create } from 'zustand';
import axiosInstance from '../config/axios.config';

const useExpertCoursesStore = create((set) => ({
  courses: [],
  isLoading: false,
  error: null,

  fetchExpertCourses: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/expert/courses');
      if (response.status === 200) {
        set({ 
          courses: response.data,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch expert courses",
        isLoading: false
      });
      console.error('Error fetching expert courses:', error);
    }
  },

  updateCourse: (courseId, data) => set(state => ({
    courses: state.courses.map(course =>
      course._id === courseId ? { ...course, ...data } : course
    )
  })),

  addCourse: (course) => set(state => ({
    courses: [...state.courses, course]
  })),

  deleteCourse: (courseId) => set(state => ({
    courses: state.courses.filter(course => course._id !== courseId)
  })),

  clearError: () => set({ error: null })
}));

export default useExpertCoursesStore;