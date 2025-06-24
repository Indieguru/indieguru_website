import { create } from 'zustand';
import axiosInstance from '../config/axios.config';

const useExpertStore = create((set) => ({
  expertData: {
    name: "",
    email: "",
    phone: "",
    title: "",
    firstName: "",
    lastName: "",
    profilePicture: "/placeholder-user.jpg", // Added default profile picture
    education: [],
    experience: [],
    certifications: [],
    industries: [],
    targetAudience: [],
    links: [], // Add links array to store
    profileCompletion: 0,
    activeStreak: 0,
    expertise: [],
    upcomingSessions: [],
    status: "not requested", // Add status field with default value
    earnings: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      outstanding: 0
    },
    outstandingAmount: {
      total: 0,
      sessions: 0,
      courses: 0,
      cohorts: 0
    },
    sessionPricing: {
      expertFee: 0,
      platformFee: 0,
      currency: 'INR'
    },
    analytics: {
      courses: {
        earnings: 0,
        monthlyGrowth: 0,
        delivered: 0
      },
      sessions: {
        earnings: 0,
        monthlyGrowth: 0,
        delivered: 0
      },
      cohorts: {
        earnings: 0,
        monthlyGrowth: 0,
        delivered: 0
      }
    },
    ratings: {
      overall: 0,
      total: 0,
      breakdown: {}
    },
    studentsEnrolled: 0,
    completedSessions: []
  },
  
  isLoading: false,
  error: null,

  fetchExpertData: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/expert/dashboard');
      
      if (response.status === 200) {
        console.log('Expert data received:', response.data);
        
        set({ 
          expertData: {
            ...response.data,
            // Make sure links field is preserved from the response
            links: response.data.links || [],
            profilePicture: response.data.profilePicture || "/placeholder-user.jpg" // Ensure default if not provided
          },
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error fetching expert data:', error);
      set({ 
        error: error.response?.data?.message || "Failed to fetch expert data",
        isLoading: false
      });
    }
  },
  
  setExpertData: (data) => set((state) => ({
    expertData: { ...state.expertData, ...data }
  })),
  
  updateEarnings: (newEarnings) => set((state) => ({
    expertData: {
      ...state.expertData,
      earnings: { ...state.expertData.earnings, ...newEarnings }
    }
  })),

  updateOutstandingAmount: (newOutstanding) => set((state) => ({
    expertData: {
      ...state.expertData,
      outstandingAmount: { ...state.expertData.outstandingAmount, ...newOutstanding }
    }
  })),
  
  updateAnalytics: (type, data) => set((state) => ({
    expertData: {
      ...state.expertData,
      analytics: {
        ...state.expertData.analytics,
        [type]: { ...state.expertData.analytics[type], ...data }
      }
    }
  })),
  
  updateRatings: (newRatings) => set((state) => ({
    expertData: {
      ...state.expertData,
      ratings: { ...state.expertData.ratings, ...newRatings }
    }
  })),

  updateEducation: (education) => set((state) => ({
    expertData: {
      ...state.expertData,
      education
    }
  })),

  updateExperience: (experience) => set((state) => ({
    expertData: {
      ...state.expertData,
      experience
    }
  })),

  updateCertifications: (certifications) => set((state) => ({
    expertData: {
      ...state.expertData,
      certifications
    }
  })),

  updateProfilePicture: (profilePicture) => set((state) => ({
    expertData: {
      ...state.expertData,
      profilePicture
    }
  })),

  updateIndustries: (industries) => set((state) => ({
    expertData: {
      ...state.expertData,
      industries
    }
  })),

  updateLinks: (links) => set((state) => ({
    expertData: {
      ...state.expertData,
      links
    }
  })),
  
  updateStatus: (status) => set((state) => ({
    expertData: {
      ...state.expertData,
      status
    }
  })),
  
  clearError: () => set({ error: null }),

  reset: () => set({
    expertData: {
      name: "",
      email: "",
      phone: "",
      title: "",
      firstName: "",
      lastName: "",
      profilePicture: "/placeholder-user.jpg", // Added default profile picture
      education: [],
      experience: [],
      certifications: [],
      industries: [],
      targetAudience: [],
      links: [], // Added links array to reset
      profileCompletion: 0,
      activeStreak: 0,
      expertise: [],
      upcomingSessions: [],
      status: "not requested", // Add status field with default value
      earnings: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
        outstanding: 0
      },
      outstandingAmount: {
        total: 0,
        sessions: 0,
        courses: 0,
        cohorts: 0
      },
      sessionPricing: {
        expertFee: 0,
        platformFee: 0,
        currency: 'INR'
      },
      analytics: {
        courses: { earnings: 0, monthlyGrowth: 0, delivered: 0 },
        sessions: { earnings: 0, monthlyGrowth: 0, delivered: 0 },
        cohorts: { earnings: 0, monthlyGrowth: 0, delivered: 0 }
      },
      ratings: {
        overall: 0,
        total: 0,
        breakdown: {}
      },
      studentsEnrolled: 0,
      completedSessions: []
    },
    isLoading: false,
    error: null
  })
}));

export default useExpertStore;