"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import LoadingScreen from "../components/common/LoadingScreen"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card } from "../components/ui/card"
import { Plus, Pencil } from "lucide-react"
import { Doughnut } from "react-chartjs-2"
import "chart.js/auto"
import useUserStore from "../store/userStore"
import InputBox from "../components/util/InputBox"
import { ErrorPopup } from "../components/ui/error-popup"
import axiosInstance from "../config/axios.config"
import useUserTypeStore from "../store/userTypeStore"
import ProfilePictureModal from "../components/modals/ProfilePictureModal"
import checkAuth from '../utils/checkAuth'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const { user, fetchUser, refreshUser } = useUserStore()
  const navigate = useNavigate();
  const location = useLocation();
  const { userType, setUserType } = useUserTypeStore();
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState(null);
  const [coursesCount, setCoursesCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [careerFlowData, setCareerFlowData] = useState({
    currentRole: "",
    degree: "",
    stream: "",
    linkedinUrl: "",
    careerJourney: "",
    learningStyle: "",
    otherLearningStyle: ""
  });

  const [newSkill, setNewSkill] = useState("")
  const [newGoal, setNewGoal] = useState("")
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false)
  const [showSkillDropdown, setShowSkillDropdown] = useState(false)
  const [showGoalDropdown, setShowGoalDropdown] = useState(false)
  
  // New state for multiple selections
  const [tempSelectedSkills, setTempSelectedSkills] = useState([])
  const [tempSelectedGoals, setTempSelectedGoals] = useState([])
  const [isAddingSkills, setIsAddingSkills] = useState(false)
  const [isAddingGoals, setIsAddingGoals] = useState(false)

  // Skills list
  const skillsList = [
    "Software Development",
    "AI/ML", 
    "Data Science",
    "Cybersecurity",
    "Cloud Computing & DevOps",
    "Product Management",
    "Psychology & Therapy",
    "Business Analysis",
    "Strategy & Operations",
    "Data Analysis",
    "Chartered Accountancy (CA)",
    "CFA",
    "Investment Banking",
    "Financial Planning & Analysis",
    "FinTech Roles",
    "Corporate & Criminal Law",
    "Company Secretary",
    "Digital Marketing",
    "SEO",
    "Graphic Designing",
    "PR & Corporate Communication",
    "Content Writing & Copywriting",
    "Growth Marketing",
    "Industrial Design",
    "Robotics & Mechatronics",
    "UI/UX & Interaction Design",
    "Fashion Design",
    "Interior & Spatial Design",
    "Animation & Illustration",
    "Fine Arts & Applied Arts",
    "Architecture",
    "Public Policy & Governance",
    "Exam Prep Mentorship -UPSC",
    "Exam Prep Mentorship- CUET",
    "Exam Prep Mentorship - NET",
    "Exam Prep Mentorship - JEE",
    "Exam Prep Mentorship - GMAT/GRE",
    "Exam Prep Mentorship - Banking and other govt exams",
    "Exam Prep Mentorship - NET/JRF",
    "Journalism (Print & Digital)",
    "Content Creation (YouTube, Podcasting)",
    "Film & Video Production",
    "Advertising & Copywriting",
    "OTT & New Media",
    "Business Growth",
    "Program Management",
    "Hotel Management",
    "Culinary Arts & Bakery",
    "Tourism & Travel",
    "Aviation & Cabin Crew",
    "Event Management",
    "Make Up Artist",
    "Dietitian/ Nutrition",
    "Fitness Training",
    "Career Discovery/ Career Councelling",
    "Study Abroad Guidance",
    "Soft Skills & Interview Prep",
    "Resume Building & LinkedIn & Job search",
    "PHD admission mentorship",
    "Stream Selection"
  ];

  // Goals list
  const goalsList = [
    "Sessions",
    "Cohort",
    "Courses"
  ];

  useEffect(() => {
    const handleAuth = async () => {
      const data = await checkAuth(setUserType, setLoading);
      setAuthData(data);
    };
    handleAuth();
  }, [setUserType]);

  useEffect(() => {
    if (authData) {
      if (userType === "not_signed_in") {
        navigate("/signup");
        return;
      }
      fetchUser(); // Initial fetch will use cache if available
    }
  }, [userType, navigate, fetchUser, authData]);

  // Fetch courses and sessions data
  useEffect(() => {
    if (userType === "student" && user?._id) {
      // Fetch purchased courses
      const fetchUserCourses = async () => {
        try {
          const response = await axiosInstance.get('/user/courses');
          if (response.data) {
            setCoursesCount(response.data.length);
          }
        } catch (error) {
          console.error('Error fetching user courses:', error);
        }
      };

      // Fetch booked sessions
      const fetchUserSessions = async () => {
        try {
          const response = await axiosInstance.get('/user/sessions');
          if (response.data) {
            setSessionsCount(response.data.length);
          }
        } catch (error) {
          console.error('Error fetching user sessions:', error);
        }
      };

      fetchUserCourses();
      fetchUserSessions();
    }
  }, [userType, user]);

  // Handle hash routing
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    contactNo1: "",
    email: "",
    gender: "",
    skills: [],
    goals: [],
    profilePicture: "/placeholder-user.png",
    completedSteps: 0,
    totalSteps: 8,
  })

  const [editingField, setEditingField] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({})

  useEffect(() => {
    setProfileData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      contactNo1: user?.phone || "",
      email: user?.email || "",
      gender: user?.gender || "",
      skills: user?.interests || [],
      goals: user?.goals || [],
      profilePicture: "/placeholder-user.png",
      completedSteps: 0,
      totalSteps: 8,
    })
  }, [user])

  useEffect(() => {
    if (user?.careerFlow) {
      setCareerFlowData({
        currentRole: user.careerFlow.currentRole || "",
        degree: user.careerFlow.degree || "",
        stream: user.careerFlow.stream || "",
        linkedinUrl: user.careerFlow.linkedinUrl || "",
        careerJourney: user.careerFlow.careerJourney || "",
        learningStyle: user.careerFlow.learningStyle || "",
        otherLearningStyle: user.careerFlow.otherLearningStyle || ""
      });
    }
  }, [user]);

  useEffect(() => {
    const calculateCompletedSteps = () => {
      let completedSteps = 0
      if (profileData.firstName) completedSteps++
      if (profileData.lastName) completedSteps++
      if (profileData.email) completedSteps++
      if (profileData.gender) completedSteps++
      if (profileData.contactNo1) completedSteps++
      if (profileData.skills.length > 0) completedSteps++
      if (profileData.goals.length > 0) completedSteps++
      if (profileData.profilePicture) completedSteps++
      return completedSteps
    }

    const newCompletedSteps = calculateCompletedSteps()
    if (newCompletedSteps !== profileData.completedSteps) {
      setProfileData((prev) => ({
        ...prev,
        completedSteps: newCompletedSteps,
      }))
    }
  }, [profileData.firstName, profileData.lastName, profileData.email, profileData.gender, profileData.contactNo1, profileData.skills, profileData.goals, profileData.profilePicture])

  const completionPercentage = (profileData.completedSteps / profileData.totalSteps) * 100

  const chartData1 = {
    labels: ["Value 1", "Value 2", "Value 3"],
    datasets: [
      {
        data: [40, 40, 20],
        backgroundColor: ["#a3d7ff", "#fff0cc", "#cceeed"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  }

  const chartData2 = {
    labels: ["Value 1", "Value 2", "Value 3"],
    datasets: [
      {
        data: [40, 40, 20],
        backgroundColor: ["#a3d7ff", "#fff0cc", "#cceeed"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  }

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    maintainAspectRatio: false,
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setProfileData(editedData)

    let completedSteps = 0
    if (editedData.firstName) completedSteps++
    if (editedData.lastName) completedSteps++
    if (editedData.email) completedSteps++
    if (editedData.gender) completedSteps++
    if (editedData.contactNo1) completedSteps++
    if (editedData.skills.length > 0) completedSteps++
    if (editedData.goals.length > 0) completedSteps++
    if (editedData.profilePicture) completedSteps++

    setProfileData((prev) => ({
      ...editedData,
      completedSteps,
    }))

    setIsEditing(false)
  }

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      const skillToAdd = newSkill.trim();
      if (profileData.skills.some(skill => skill.toLowerCase() === skillToAdd.toLowerCase())) {
        setErrorMessage("This skill is already added!");
        return;
      }

      axiosInstance
        .put("/user/update", {
          interests: [...profileData.skills, skillToAdd]
        })
        .then((res) => {
          if (res.status === 200) {
            refreshUser(); // Force refresh after adding skill
            setProfileData((prev) => ({
              ...prev,
              skills: [...prev.skills, skillToAdd],
            }));
            setNewSkill("");
            setIsEditing(false);
            setShowSkillDropdown(false);
          } else {
            setErrorMessage("Failed to update. Please try again.");
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage("Failed to update. Please try again.");
        });
    }
  };

  const handleAddGoal = () => {
    if (newGoal.trim() !== "") {
      const goalToAdd = newGoal.trim();
      if (profileData.goals.some(goal => goal.toLowerCase() === goalToAdd.toLowerCase())) {
        setErrorMessage("This goal is already added!");
        return;
      }

      axiosInstance
        .put("/user/update", {
          goals: [...profileData.goals, goalToAdd]
        })
        .then((res) => {
          if (res.status === 200) {
            refreshUser(); // Force refresh after adding goal
            setProfileData((prev) => ({
              ...prev,
              goals: [...prev.goals, goalToAdd],
            }));
            setNewGoal("");
            setIsEditingGoal(false);
            setShowGoalDropdown(false);
          } else {
            setErrorMessage("Failed to update. Please try again.");
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage("Failed to update. Please try again.");
        });
    }
  };

  const handleSkillSelect = (skill) => {
    if (profileData.skills.some(existingSkill => existingSkill.toLowerCase() === skill.toLowerCase())) {
      setErrorMessage("This skill is already added!");
      setShowSkillDropdown(false);
      return;
    }

    axiosInstance
      .put("/user/update", {
        interests: [...profileData.skills, skill]
      })
      .then((res) => {
        if (res.status === 200) {
          refreshUser();
          setProfileData((prev) => ({
            ...prev,
            skills: [...prev.skills, skill],
          }));
          setShowSkillDropdown(false);
        } else {
          setErrorMessage("Failed to update. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Failed to update. Please try again.");
      });
  };

  const handleGoalSelect = (goal) => {
    if (profileData.goals.some(existingGoal => existingGoal.toLowerCase() === goal.toLowerCase())) {
      setErrorMessage("This goal is already added!");
      setShowGoalDropdown(false);
      return;
    }

    axiosInstance
      .put("/user/update", {
        goals: [...profileData.goals, goal]
      })
      .then((res) => {
        if (res.status === 200) {
          refreshUser();
          setProfileData((prev) => ({
            ...prev,
            goals: [...prev.goals, goal],
          }));
          setShowGoalDropdown(false);
        } else {
          setErrorMessage("Failed to update. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Failed to update. Please try again.");
      });
  };

  const handleCancelSkill = () => {
    setNewSkill("");
    setIsEditing(false);
  };

  const handleGoalClick = () => {
    setIsEditingGoal(true);
  };

  const handleCancelGoal = () => {
    setNewGoal("");
    setIsEditingGoal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFieldEdit = (field) => {
    setEditingField(field)
    setEditedData((prev) => ({
      ...prev,
      [field]: profileData[field],
    }))
  }

  const handleFieldSave = () => {
    setProfileData((prev) => ({
      ...prev,
      [editingField]: editedData[editingField],
    }))
    
    setUser((prev) => ({
      ...prev,
      [editingField]: editedData[editingField],
    }))

    setEditingField(null)
  }

  const handleFieldCancel = () => {
    setEditedData((prev) => ({
      ...prev,
      [editingField]: profileData[editingField],
    }))
    setEditingField(null)
  }

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/user/auth/signout");
      if (res.status === 200) {
        setUserType("not_signed_in");
      }
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      setErrorMessage("Failed to logout. Please try again.");
    }
  };

  const handleUpdateProfilePicture = async (file) => {
    try {
      console.log('Uploading file:', file.name, file.size, file.type);
      
      const formData = new FormData();
      formData.append('image', file);
  
      const response = await axiosInstance.post('/user/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
  
      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          profilePicture: response.data.profilePicture
        }));
        refreshUser(); // Force refresh after profile picture update
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to update profile picture';
      setErrorMessage(errorMessage);
    }
  };

  const handleCareerFlowSubmit = async () => {
    try {
      await axiosInstance.post("/user/career-flow", {
        careerFlow: {
          ...careerFlowData,
          lastUpdated: new Date()
        }
      });
      toast.success("Career preferences updated successfully");
      
      // Refresh user data to get the updated career flow
      refreshUser();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Failed to update career preferences");
    }
  };

  // New handler functions for multiple selections
  const handleSkillDropdownSelect = (skill) => {
    if (profileData.skills.some(existingSkill => existingSkill.toLowerCase() === skill.toLowerCase())) {
      setErrorMessage("This skill is already added!");
      return;
    }
    if (tempSelectedSkills.some(tempSkill => tempSkill.toLowerCase() === skill.toLowerCase())) {
      setErrorMessage("This skill is already selected!");
      return;
    }
    setTempSelectedSkills([...tempSelectedSkills, skill]);
    setIsAddingSkills(true);
  };

  const handleGoalDropdownSelect = (goal) => {
    if (profileData.goals.some(existingGoal => existingGoal.toLowerCase() === goal.toLowerCase())) {
      setErrorMessage("This goal is already added!");
      return;
    }
    if (tempSelectedGoals.some(tempGoal => tempGoal.toLowerCase() === goal.toLowerCase())) {
      setErrorMessage("This goal is already selected!");
      return;
    }
    setTempSelectedGoals([...tempSelectedGoals, goal]);
    setIsAddingGoals(true);
  };

  const handleRemoveTempSkill = (skillToRemove) => {
    setTempSelectedSkills(tempSelectedSkills.filter(skill => skill !== skillToRemove));
    if (tempSelectedSkills.length === 1) {
      setIsAddingSkills(false);
    }
  };

  const handleRemoveTempGoal = (goalToRemove) => {
    setTempSelectedGoals(tempSelectedGoals.filter(goal => goal !== goalToRemove));
    if (tempSelectedGoals.length === 1) {
      setIsAddingGoals(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = profileData.skills.filter(skill => skill !== skillToRemove);
    axiosInstance
      .put("/user/update", { interests: updatedSkills })
      .then((res) => {
        if (res.status === 200) {
          refreshUser();
          setProfileData(prev => ({ ...prev, skills: updatedSkills }));
        } else {
          setErrorMessage("Failed to remove skill. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Failed to remove skill. Please try again.");
      });
  };

  const handleRemoveGoal = (goalToRemove) => {
    const updatedGoals = profileData.goals.filter(goal => goal !== goalToRemove);
    axiosInstance
      .put("/user/update", { goals: updatedGoals })
      .then((res) => {
        if (res.status === 200) {
          refreshUser();
          setProfileData(prev => ({ ...prev, goals: updatedGoals }));
        } else {
          setErrorMessage("Failed to remove goal. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Failed to remove goal. Please try again.");
      });
  };

  const handleSaveSkills = () => {
    if (tempSelectedSkills.length === 0) {
      setErrorMessage("No skills selected to save!");
      return;
    }

    const newSkills = [...profileData.skills, ...tempSelectedSkills];
    axiosInstance
      .put("/user/update", { interests: newSkills })
      .then((res) => {
        if (res.status === 200) {
          refreshUser();
          setProfileData(prev => ({ ...prev, skills: newSkills }));
          setTempSelectedSkills([]);
          setIsAddingSkills(false);
          setShowSkillDropdown(false);
          toast.success("Skills saved successfully!");
        } else {
          setErrorMessage("Failed to save skills. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Failed to save skills. Please try again.");
      });
  };

  const handleSaveGoals = () => {
    if (tempSelectedGoals.length === 0) {
      setErrorMessage("No goals selected to save!");
      return;
    }

    const newGoals = [...profileData.goals, ...tempSelectedGoals];
    axiosInstance
      .put("/user/update", { goals: newGoals })
      .then((res) => {
        if (res.status === 200) {
          refreshUser();
          setProfileData(prev => ({ ...prev, goals: newGoals }));
          setTempSelectedGoals([]);
          setIsAddingGoals(false);
          setShowGoalDropdown(false);
          toast.success("Goals saved successfully!");
        } else {
          setErrorMessage("Failed to save goals. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Failed to save goals. Please try again.");
      });
  };

  const handleCancelSkillSelection = () => {
    setTempSelectedSkills([]);
    setIsAddingSkills(false);
    setShowSkillDropdown(false);
  };

  const handleCancelGoalSelection = () => {
    setTempSelectedGoals([]);
    setIsAddingGoals(false);
    setShowGoalDropdown(false);
  };

  if (loading || !authData) {
    return <LoadingScreen />;
  }


  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <ErrorPopup message={errorMessage} onClose={() => setErrorMessage("")} />
      <Header className="sticky top-0 z-50 bg-white shadow-md" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Card id="basic-info" className="p-8 mb-8 border border-gray-200 rounded-xl bg-white">
          <h2 className="text-2xl font-semibold text-[#232636] mb-6 border-b border-gray-200 pb-3 flex items-center">
            <span className="bg-blue-100 text-blue-700 p-1.5 rounded-full mr-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            My Profile
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-2 border-blue-300 p-1 bg-white cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setIsProfilePictureModalOpen(true)}>
                <img
                  src={user?.profilePicture || "/placeholder-user.png"}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <Button
                onClick={() => setIsProfilePictureModalOpen(true)}
                className="text-blue-700 hover:bg-blue-50"
              >
                Change Photo
              </Button>
            </div>

            <div className="md:w-3/4">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userType === "expert" ? (
                  <>
                    <InputBox field="First Name" value={profileData.firstName} otpRequired={false} />
                    <InputBox field="Last Name" value={profileData.lastName} otpRequired={false} />
                    <InputBox field="Title" value={profileData.title} otpRequired={false} />
                    <InputBox field="Contact No" value={profileData.contactNo1} otpRequired={false} />
                    <InputBox field="Email" value={profileData.email} otpRequired={false} />
                    <InputBox field="Expertise" value={profileData.expertise?.join(", ")} otpRequired={false} />
                  </>
                ) : (
                  <>
                    <InputBox field="First Name" value={profileData.firstName} otpRequired={false} />
                    <InputBox field="Last Name" value={profileData.lastName} otpRequired={false} />
                    <InputBox field="Contact No" value={profileData.contactNo1} otpRequired={false} />
                    <InputBox field="Email" value={profileData.email} otpRequired={false} />
                    <InputBox field="Gender" value={profileData.gender} otpRequired={false} />
                  </>
                )}
              </form>
            </div>
          </div>
        </Card>

        {userType === "student" ? (
          <>
            <Card id="skills" className="p-8 mb-8 border border-gray-200 rounded-xl bg-white">
              <h2 className="text-2xl font-semibold text-[#232636] mb-4 border-b border-gray-200 pb-3 flex items-center">
                <span className="bg-blue-100 text-blue-700 p-1.5 rounded-full mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                My Interest Map
              </h2>

              <div className="flex flex-wrap gap-3 mb-5 items-center">
                {profileData.skills?.map((skill, index) => (
                  <span key={index} className="px-5 py-2.5 mt-2 bg-blue-800 text-white rounded-lg text-sm font-medium border border-blue-700 flex items-center h-10">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-white hover:text-red-200 font-bold text-lg"
                    >
                      &times;
                    </button>
                  </span>
                ))}

                <div className="relative">
                  <Button
                    onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                    className="px-5 py-2.5 border border-blue-300 bg-white text-blue-700 rounded-lg text-sm font-medium flex items-center gap-1.5 mt-3"
                  >
                    <Plus size={16} />
                    Choose Your Interests
                  </Button>
                  {showSkillDropdown && (
                    <div className="absolute mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {skillsList.map((skill, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSkillDropdownSelect(skill)}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {isAddingSkills && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Selected Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {tempSelectedSkills.map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-300 flex items-center">
                        {skill}
                        <button
                          onClick={() => handleRemoveTempSkill(skill)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleSaveSkills} className="bg-blue-800 text-white px-4 py-2 rounded-lg">
                      Save Skills
                    </Button>
                    <Button onClick={handleCancelSkillSelection} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
            <Card id="goals" className="p-8 mb-8 border border-gray-200 rounded-xl bg-white">
              <h2 className="text-2xl font-semibold text-[#232636] mb-4 border-b border-gray-200 pb-3 flex items-center">
                <span className="bg-green-100 text-[#00b6c4] p-1.5 rounded-full mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                My Focus Areas
              </h2>

              <div className="flex flex-wrap gap-3 mb-5">
                {profileData.goals?.map((goal, index) => (
                  <span key={index} className="px-5 py-2.5 bg-[#00b6c4] text-white rounded-lg text-sm font-medium border border-[#00b6c4] mb-1 flex items-center">
                    {goal}
                    <button
                      onClick={() => handleRemoveGoal(goal)}
                      className="ml-2 text-white hover:text-red-200 font-bold text-lg"
                    >
                      &times;
                    </button>
                  </span>
                ))}

                <div className="relative">
                  <Button
                    onClick={() => setShowGoalDropdown(!showGoalDropdown)}
                    className="px-5 py-2.5 border border-green-300 bg-white text-[#00b6c4] rounded-lg text-sm font-medium flex items-center gap-1.5 h-10"
                  >
                    <Plus size={16} />
                    Select Focus Areas
                  </Button>
                  {showGoalDropdown && (
                    <div className="absolute mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      {goalsList.map((goal, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleGoalDropdownSelect(goal)}
                        >
                          {goal}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {isAddingGoals && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Selected Goals:</h3>
                  <div className="flex flex-wrap gap-2">
                    {tempSelectedGoals.map((goal, index) => (
                      <span key={index} className="px-4 py-2 bg-green-100 text-[#00b6c4] rounded-lg text-sm font-medium border border-green-300 flex items-center">
                        {goal}
                        <button
                          onClick={() => handleRemoveTempGoal(goal)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleSaveGoals} className="bg-[#00b6c4] text-white px-4 py-2 rounded-lg">
                      Save Goals
                    </Button>
                    <Button onClick={handleCancelGoalSelection} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </>
        ) : (
          <>
            <Card id="expertise" className="p-8 mb-8 border border-gray-200 rounded-xl bg-white">
              <h2 className="text-2xl font-semibold text-[#232636] mb-4 border-b border-gray-200 pb-3 flex items-center">
                <span className="bg-blue-100 text-blue-700 p-1.5 rounded-full mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Expertise & Skills
              </h2>
              {/* ...existing expertise content... */}
            </Card>
            <Card id="education" className="p-8 mb-8 border border-gray-200 rounded-xl bg-white">
              <h2 className="text-2xl font-semibold text-[#232636] mb-4 border-b border-gray-200 pb-3 flex items-center">
                <span className="bg-amber-100 text-amber-700 p-1.5 rounded-full mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Education
              </h2>
              {/* ...existing education content... */}
            </Card>
            <Card id="experience" className="p-8 mb-8 border border-gray-200 rounded-xl bg-white">
              <h2 className="text-2xl font-semibold text-[#232636] mb-4 border-b border-gray-200 pb-3 flex items-center">
                <span className="bg-green-100 text-[#00b6c4] p-1.5 rounded-full mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.29 7L12 12l8.71-5M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Experience
              </h2>
              {/* ...existing experience content... */}
            </Card>
          </>
        )}

        <Card id="progress" className="p-8 mb-8 border border-gray-200 rounded-xl bg-white">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4 border-b border-gray-200 pb-3 flex items-center">
            <span className="bg-blue-100 text-blue-700 p-1.5 rounded-full mr-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            My Progress
          </h2>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile completion</span>
              <span className="text-sm font-medium text-blue-700">{completionPercentage.toFixed(0)}%</span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-800 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            <div className="text-sm text-gray-600 mt-2 flex items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {profileData.completedSteps}/{profileData.totalSteps} steps completed
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-[#232636] mb-3">
                <div className="text-blue-700 bg-white p-1.5 rounded-full border border-blue-200">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 17L9 11L13 15L21 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 7H21V11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">Profile Level</span>
              </div>
              <div className="text-2xl font-bold text-[#232636]">{profileData.completedSteps}/{profileData.totalSteps}</div>
            </div>

            <div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 text-[#232636] mb-3">
                <div className="text-amber-700 bg-white p-1.5 rounded-full border border-amber-200">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 17L9 11L13 15L21 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 7H21V11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">Courses Enrolled</span>
              </div>
              <div className="text-2xl font-bold text-[#232636]">{coursesCount}</div>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-[#232636] mb-3">
                <div className="text-[#00b6c4] bg-white p-1.5 rounded-full border border-green-200">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 17L9 11L13 15L21 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 7H21V11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">Skills Learned</span>
              </div>
              <div className="text-2xl font-bold text-[#232636]">{sessionsCount}</div>
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-8 border border-gray-200 rounded-xl bg-white">
          <h2 className="text-2xl font-semibold text-[#232636] mb-6 border-b border-gray-200 pb-3 flex items-center">
            <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-full mr-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            My Learning Profile
          </h2>

          <div className="space-y-6">
            {/* Current Role Selection */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900">Tell us where you are -</label>
              <p className="text-sm text-gray-500">Help us know if you are a Student or a Working Professional</p>
              <select 
                value={careerFlowData.currentRole}
                onChange={(e) => setCareerFlowData(prev => ({ ...prev, currentRole: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
              >
                <option value="">Select your current role</option>
                <option value="undergraduate">I am doing my graduation</option>
                <option value="working">I am working currently</option>
                <option value="postgraduate">I am pursuing masters</option>
                <option value="highschool">I am in Class 11th or 12th</option>
                <option value="secondary">I am in Class 9th or 10th</option>
              </select>
            </div>

            {/* Conditional Fields Based on Role */}
            {careerFlowData.currentRole && careerFlowData.currentRole !== 'secondary' && (
              <div className="space-y-4">
                {(careerFlowData.currentRole === 'undergraduate' || careerFlowData.currentRole === 'postgraduate') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">What's your degree?</label>
                    <input
                      type="text"
                      value={careerFlowData.degree}
                      onChange={(e) => setCareerFlowData(prev => ({ ...prev, degree: e.target.value }))}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                      placeholder="Enter your degree"
                    />
                  </div>
                )}

                {careerFlowData.currentRole === 'working' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn Profile or Resume URL (Optional)</label>
                    <input
                      type="url"
                      value={careerFlowData.linkedinUrl}
                      onChange={(e) => setCareerFlowData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                )}

                {careerFlowData.currentRole === 'highschool' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">What's your stream?</label>
                    <input
                      type="text"
                      value={careerFlowData.stream}
                      onChange={(e) => setCareerFlowData(prev => ({ ...prev, stream: e.target.value }))}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                      placeholder="Enter your stream"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Career Journey Question */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900">What best describes where you are in your journey right now?</label>
              <p className="text-sm text-gray-500">Choose the one that feels most like you</p>
              <select
                value={careerFlowData.careerJourney}
                onChange={(e) => setCareerFlowData(prev => ({ ...prev, careerJourney: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
              >
                <option value="">Select your career journey</option>
                <option value="validate">I’m on a path - just need to validate if it’s the right one</option>
                <option value="clarity">I kinda know the field - but need more clarity and direction</option>
                <option value="explore">I’m still exploring - open to discovering what fits me best</option>
                <option value="guidance">Honestly, I feel stuck - not sure how to move forward</option>
              </select>
            </div>

            {/* Learning Style Question */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900">How do you learn best?</label>
              <p className="text-sm text-gray-500">Choose what feels most “you” — no one-size-fits-all here</p>
              <select
                value={careerFlowData.learningStyle}
                onChange={(e) => setCareerFlowData(prev => ({ ...prev, learningStyle: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
              >
                <option value="">Select your learning style</option>
                <option value="oneOnOne">I thrive with regular 1:1 sessions and personal guidance</option>
                <option value="selfPaced">I’m good with a nudge - I prefer exploring on my own post-session</option>
                <option value="structured">I need a structured path - give me a clear curriculum and plan</option>
                <option value="group">I love learning with others - group discussions and shared ideas work best</option>
                <option value="other">Something else works better for me</option>
              </select>

              {careerFlowData.learningStyle === 'other' && (
                <input
                  type="text"
                  value={careerFlowData.otherLearningStyle}
                  onChange={(e) => setCareerFlowData(prev => ({ ...prev, otherLearningStyle: e.target.value }))}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                  placeholder="Please specify your learning style"
                />
              )}
            </div>

            <Button
              onClick={handleCareerFlowSubmit}
              className="w-full bg-indigo-900 text-white py-3 rounded-lg hover:bg-indigo-800 transition-colors"
            >
              Save Preferences
            </Button>
          </div>
        </Card>

        <Button onClick={handleLogout} className="bg-red-600 text-white mt-4 px-8 py-3 rounded-lg font-medium flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Logout
        </Button>
      </main>

      <ProfilePictureModal
        isOpen={isProfilePictureModalOpen}
        onClose={() => setIsProfilePictureModalOpen(false)}
        currentPicture={user?.profilePicture || "/placeholder-user.png"}
        onSave={handleUpdateProfilePicture}
      />

      <Footer />
    </div>
  )
}

export default Profile







