// Simulated database service for interests, goals, and user data

// Sample interests data that would come from a database
const interestsDatabase = [
    { id: 1, name: "UI/UX", category: "Design" },
    { id: 2, name: "Programming", category: "Development" },
    { id: 3, name: "Web Development", category: "Development" },
    { id: 4, name: "App Development", category: "Development" },
    { id: 5, name: "Graphic Design", category: "Design" },
    { id: 6, name: "Digital Marketing", category: "Marketing" },
    { id: 7, name: "Content Writing", category: "Content" },
    { id: 8, name: "SEO", category: "Marketing" },
    { id: 9, name: "Data Science", category: "Data" },
    { id: 10, name: "Machine Learning", category: "Data" },
    { id: 11, name: "Artificial Intelligence", category: "Data" },
    { id: 12, name: "Blockchain", category: "Technology" },
    { id: 13, name: "Cloud Computing", category: "Technology" },
    { id: 14, name: "DevOps", category: "Development" },
    { id: 15, name: "Cybersecurity", category: "Technology" },
  ]
  
  // Sample goals data that would come from a database
  const goalsDatabase = [
    { id: 1, name: "Learn React", category: "Development" },
    { id: 2, name: "Master UI/UX Design", category: "Design" },
    { id: 3, name: "Become a Full Stack Developer", category: "Development" },
    { id: 4, name: "Learn Data Science", category: "Data" },
    { id: 5, name: "Improve SEO Skills", category: "Marketing" },
    { id: 6, name: "Build a Mobile App", category: "Development" },
    { id: 7, name: "Learn Cloud Computing", category: "Technology" },
    { id: 8, name: "Master Digital Marketing", category: "Marketing" },
    { id: 9, name: "Become a Content Writer", category: "Content" },
    { id: 10, name: "Learn Blockchain", category: "Technology" },
    { id: 11, name: "Improve Cybersecurity Skills", category: "Technology" },
    { id: 12, name: "Master DevOps", category: "Development" },
    { id: 13, name: "Learn Machine Learning", category: "Data" },
    { id: 14, name: "Become an AI Expert", category: "Data" },
    { id: 15, name: "Improve Graphic Design Skills", category: "Design" },
  ]
  
  // Simulated API calls with delays to mimic real API behavior
  export const fetchInterests = async (searchTerm = "") => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    if (!searchTerm) {
      return interestsDatabase
    }
  
    // Filter interests based on search term
    return interestsDatabase.filter(
      (interest) =>
        interest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interest.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }
  
  export const fetchGoals = async (searchTerm = "") => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    if (!searchTerm) {
      return goalsDatabase
    }
  
    // Filter goals based on search term
    return goalsDatabase.filter(
      (goal) =>
        goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }
  
  // Simulated MongoDB user data operations
  export const updateUserProfile = async (userId, profileData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))
  
    console.log("Updating user profile in MongoDB:", userId, profileData)
  
    // Simulate successful update
    return {
      success: true,
      message: "Profile updated successfully",
      data: profileData,
    }
  }
  
  // Simulated Cloudinary upload
  export const uploadToCloudinary = async (file) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))
  
    // In a real implementation, you would use Cloudinary's upload API
    // For simulation, we'll create a fake URL based on the file name
    const fakeCloudinaryUrl = `https://res.cloudinary.com/demo/image/upload/v1/${Date.now()}_${file.name.replace(/\s+/g, "_")}`
  
    console.log("Uploaded to Cloudinary:", fakeCloudinaryUrl)
  
    return {
      success: true,
      url: fakeCloudinaryUrl,
      publicId: `public_id_${Date.now()}`,
    }
  }
  
  // Fetch user data (simulated)
  export const fetchUserData = async (userId) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))
  
    // Always return simulated user data
    return {
      _id: userId || "user123",
      firstName: "Riya",
      lastName: "Sharma",
      contactNo1: "99999 99123",
      contactNo2: "99999 99123",
      contactNo3: "",
      contactNo4: "",
      email: "riya.sharma@gmail.com",
      gender: "Female",
      skills: ["UI-UX", "Programming", "Web Development", "App Development"],
      interests: ["UI/UX", "Programming", "Web Development", "App Development"],
      goals: ["Learn React", "Master UI/UX Design", "Become a Full Stack Developer", "Learn Data Science"],
      profilePicture: "/placeholder.svg",
      completedSteps: 6,
      totalSteps: 8,
      indieCoins: 32,
      dailyStreak: 100,
      coursesEnrolled: 4,
      skillsLearned: 4,
    }
  }
  
  