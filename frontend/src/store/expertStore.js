import { create } from 'zustand';

const useExpertStore = create((set) => ({
  expertData: {
    name: "John Doe",
    profileCompletion: 85,
    activeStreak: 7,
    expertise: ["Web Development", "JavaScript", "React", "Node.js"],
    upcomingSessions: [
      {
        id: 1,
        title: "Advanced React Patterns",
        date: "2024-02-15",
        time: "10:00 AM",
        students: 5
      },
      {
        id: 2,
        title: "Node.js Best Practices",
        date: "2024-02-18",
        time: "2:00 PM",
        students: 3
      }
    ],
    earnings: {
      total: 25000,
      thisMonth: 3500,
      lastMonth: 4200
    },
    analytics: {
      courses: {
        earnings: 15000,
        monthlyGrowth: 12
      },
      sessions: {
        earnings: 8000,
        monthlyGrowth: 8
      },
      cohorts: {
        earnings: 2000,
        monthlyGrowth: 15
      }
    },
    ratings: {
      overall: 4.8,
      total: 127,
      breakdown: {
        5: 85,
        4: 30,
        3: 8,
        2: 3,
        1: 1
      }
    },
    avgCategoryRating: 3.9,
    studentsEnrolled: 250,
    delivered: {
      courses: 12,
      sessions: 45,
      cohorts: 4
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
  }))
}));

export default useExpertStore;