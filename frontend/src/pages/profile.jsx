"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
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

function Profile() {
  const { user, fetchUser } = useUserStore()
  const navigate = useNavigate();
  const location = useLocation();
  const { userType,setUserType } = useUserTypeStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (userType === "not_signed_in") {
          navigate("/signup");
          return;
        }
        fetchUser();
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    checkAuth();
  }, [userType]);

  useEffect(() => {
    // Handle hash routing
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
    profilePicture: "/imagecopy.png",
    completedSteps: 0,
    totalSteps: 8,
  })

  const [editingField, setEditingField] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({})
  const [newSkill, setNewSkill] = useState("")
  const [newGoal, setNewGoal] = useState("")
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setProfileData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      contactNo1: user?.phone || "",
      email: user?.email || "",
      gender: user?.gender || "",
      skills: user?.interests || [],
      goals: user?.goals || [],
      profilePicture: "/imagecopy.png",
      completedSteps: 0,
      totalSteps: 8,
    })
  }, [user])

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
            fetchUser();
            setProfileData((prev) => ({
              ...prev,
              skills: [...prev.skills, skillToAdd],
            }));
            setNewSkill("");
            setIsEditing(false);
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
            fetchUser();
            setProfileData((prev) => ({
              ...prev,
              goals: [...prev.goals, goalToAdd],
            }));
            setNewGoal("");
            setIsEditingGoal(false);
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
    // Clear user session or token logic here
    try{
      const res = await axiosInstance.post("/user/auth/signout");
      if(res.status === 200)
        setUserType("not_signed_in");
      fetchUser();
      navigate("/");
  
    }
    catch(err){
      console.error("Logout error:", err);
      setErrorMessage("Failed to logout. Please try again.");
    }

  };

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
            Basic Information
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-2 border-blue-300 p-1 bg-white">
                <img
                  src={user?.profilePicture || "/imagecopy.png"}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
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
                My Skills
              </h2>

              <div className="flex flex-wrap gap-3 mb-5 items-center">
                {profileData.skills?.map((skill, index) => (
                  <span key={index} className="px-5 py-2.5 mt-2 bg-blue-600 text-white rounded-lg text-sm font-medium border border-blue-700 flex items-center h-10">
                    {skill}
                  </span>
                ))}

                {isEditing ? (
                  <div className="flex gap-3 items-center mt-4 w-full">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter skill"
                      className="border border-blue-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSkill();
                        }
                      }}
                    />
                    <Button
                      onClick={handleAddSkill}
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelSkill}
                      className="bg-white text-gray-700 px-6 py-2.5 rounded-lg font-medium border border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 border border-blue-300 bg-white text-blue-700 rounded-lg text-sm font-medium flex items-center gap-1.5 mt-3"
                  >
                    <Plus size={16} />
                    Add Skill
                  </Button>
                )}
              </div>
            </Card>
            <Card id="goals" className="p-8 mb-8 border border-gray-200 rounded-xl bg-white">
              <h2 className="text-2xl font-semibold text-[#232636] mb-4 border-b border-gray-200 pb-3 flex items-center">
                <span className="bg-green-100 text-[#00b6c4] p-1.5 rounded-full mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                My Goals
              </h2>

              <div className="flex flex-wrap gap-3 mb-5">
                {profileData.goals?.map((goal, index) => (
                  <span key={index} className="px-5 py-2.5 bg-[#00b6c4] text-white rounded-lg text-sm font-medium border border-[#00b6c4] mb-1">
                    {goal}
                  </span>
                ))}

                {isEditingGoal ? (
                  <div className="flex gap-3 items-center mt-4 w-full">
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Add new goal"
                      className="border border-green-300 rounded-lg w-64 focus:ring-2 focus:ring-green-500 focus:border-green-400"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddGoal();
                        }
                      }}
                    />
                    <Button
                      onClick={handleAddGoal}
                      className="bg-[#00b6c4] text-white px-6 py-2.5 rounded-lg font-medium"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelGoal}
                      className="bg-white text-gray-700 px-6 py-2.5 rounded-lg font-medium border border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleGoalClick}
                    className="px-5 py-2.5 border border-green-300 bg-white text-[#00b6c4] rounded-lg text-sm font-medium flex items-center gap-1.5 h-10"
                  >
                    <Plus size={16} />
                    New Goal
                  </Button>
                )}
              </div>
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
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
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
              <div className="text-2xl font-bold text-[#232636]">4</div>
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
              <div className="text-2xl font-bold text-[#232636]">4</div>
            </div>
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

      <Footer />
    </div>
  )
}

export default Profile







