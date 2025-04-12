"use client"

import { useState, useEffect } from "react"
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

function Profile() {
  const { user, fetchUser } = useUserStore()

  useEffect(() => {
    fetchUser()
  }, [])

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
      setEditedData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleAddGoal = () => {
    if (newGoal.trim() !== "") {
      setEditedData((prev) => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()],
      }))
      setNewGoal("")
    }
  }

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

  return (
    <div className="min-h-screen bg-white pt-24">
      <Header className="sticky top-0 z-50 bg-white shadow-md" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#232636] mb-6">Basic Information</h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                <img
                  src={user.profilePicture || "/imagecopy.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:w-3/4">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#232636] mb-1">First Name</label>
                  <div className="relative group">
                    {editingField === "firstName" ? (
                      <div>
                        <Input
                          name="firstName"
                          value={editedData.firstName}
                          onChange={handleChange}
                          className="w-full border-[#d8d8d8]"
                        />
                        <div className="flex gap-2 mt-2">
                          <Button onClick={handleFieldSave} className="bg-blue-800 text-white hover:bg-[#143d65]">
                            Save
                          </Button>
                          <Button onClick={handleFieldCancel} className="bg-gray-300 text-black hover:bg-gray-400">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          value={profileData.firstName}
                          readOnly
                          className="w-full border-[#d8d8d8] bg-[#f9fbff] pr-10"
                        />
                        <Button
                          onClick={() => handleFieldEdit("firstName")}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#003265] bg-transparent hover:bg-[#f5f5f5] p-1"
                        >
                          <Pencil size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#232636] mb-1">Last Name</label>
                  <div className="relative group">
                    {editingField === "lastName" ? (
                      <div>
                        <Input
                          name="lastName"
                          value={editedData.lastName}
                          onChange={handleChange}
                          className="w-full border-[#d8d8d8]"
                        />
                        <div className="flex gap-2 mt-2">
                          <Button onClick={handleFieldSave} className="bg-blue-800 text-white hover:bg-[#143d65]">
                            Save
                          </Button>
                          <Button onClick={handleFieldCancel} className="bg-gray-300 text-black hover:bg-gray-400">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          value={profileData.lastName}
                          readOnly
                          className="w-full border-[#d8d8d8] bg-[#f9fbff] pr-10"
                        />
                        <Button
                          onClick={() => handleFieldEdit("lastName")}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#003265] bg-transparent hover:bg-[#f5f5f5] p-1"
                        >
                          <Pencil size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#232636] mb-1">Contact No.</label>
                  <div className="relative group">
                    {editingField === "contactNo1" ? (
                      <div>
                        <Input
                          name="contactNo1"
                          value={editedData.contactNo1}
                          onChange={handleChange}
                          className="w-full border-[#d8d8d8]"
                        />
                        <div className="flex gap-2 mt-2">
                          <Button onClick={handleFieldSave} className="bg-blue-800 text-white hover:bg-[#143d65]">
                            Save
                          </Button>
                          <Button onClick={handleFieldCancel} className="bg-gray-300 text-black hover:bg-gray-400">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          value={profileData.contactNo1}
                          readOnly
                          className="w-full border-[#d8d8d8] bg-[#f9fbff] pr-10"
                        />
                        <Button
                          onClick={() => handleFieldEdit("contactNo1")}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#003265] bg-transparent hover:bg-[#f5f5f5] p-1"
                        >
                          <Pencil size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#232636] mb-1">Email</label>
                  <div className="relative group">
                    {editingField === "email" ? (
                      <div>
                        <Input
                          name="email"
                          value={editedData.email}
                          onChange={handleChange}
                          className="w-full border-[#d8d8d8]"
                          type="email"
                        />
                        <div className="flex gap-2 mt-2">
                          <Button onClick={handleFieldSave} className="bg-blue-800 text-white hover:bg-[#143d65]">
                            Save
                          </Button>
                          <Button onClick={handleFieldCancel} className="bg-gray-300 text-black hover:bg-gray-400">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          value={profileData.email}
                          readOnly
                          className="w-full border-[#d8d8d8] bg-[#f9fbff] pr-10"
                        />
                        <Button
                          onClick={() => handleFieldEdit("email")}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#003265] bg-transparent hover:bg-[#f5f5f5] p-1"
                        >
                          <Pencil size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#232636] mb-1">Gender</label>
                  <div className="relative group">
                    {editingField === "gender" ? (
                      <div>
                        <select
                          name="gender"
                          value={editedData.gender}
                          onChange={handleChange}
                          className="w-full h-10 rounded-md border border-[#d8d8d8] bg-white px-3 py-2 text-sm"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="flex gap-2 mt-2">
                          <Button onClick={handleFieldSave} className="bg-blue-800 text-white hover:bg-[#143d65]">
                            Save
                          </Button>
                          <Button onClick={handleFieldCancel} className="bg-gray-300 text-black hover:bg-gray-400">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          value={profileData.gender}
                          readOnly
                          className="w-full border-[#d8d8d8] bg-[#f9fbff] pr-10"
                        />
                        <Button
                          onClick={() => handleFieldEdit("gender")}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#003265] bg-transparent hover:bg-[#f5f5f5] p-1"
                        >
                          <Pencil size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <InputBox 
                  field="Last Name" 
                  value={profileData.lastName} 
                  otpRequired={false} 
                />
                <div>
                  <p>Testing InputBox placement</p>
                </div>
              </form>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">My Progress</h2>

          <div className="mb-4">
            <div className="h-2 w-full bg-[#f5f5f5] rounded-full overflow-hidden">
              <div className="h-full bg-[#04c339]" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            <div className="text-sm text-[#676767] mt-1">
              Profile completion: {profileData.completedSteps}/{profileData.totalSteps} steps completed
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#232636] mb-1">
                <div className="text-[#04c339]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 17L9 11L13 15L21 7"
                      stroke="#04c339"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 7H21V11"
                      stroke="#04c339"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm">Profile Level</span>
              </div>
              <div className="text-2xl font-bold text-[#232636]">6/8</div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#232636] mb-1">
                <div className="text-[#04c339]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 17L9 11L13 15L21 7"
                      stroke="#04c339"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 7H21V11"
                      stroke="#04c339"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm">Courses Enrolled</span>
              </div>
              <div className="text-2xl font-bold text-[#232636]">4</div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#232636] mb-1">
                <div className="text-[#04c339]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 17L9 11L13 15L21 7"
                      stroke="#04c339"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 7H21V11"
                      stroke="#04c339"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm">Skills Learned</span>
              </div>
              <div className="text-2xl font-bold text-[#232636]">4</div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#232636] mb-1">
                <div className="text-[#fbb236]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="#fbb236"
                      stroke="#fbb236"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm">Daily Streak</span>
              </div>
              <div className="text-2xl font-bold text-[#232636]">100</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">My Skills</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {profileData.skills?.map((skill, index) => (
              <span key={index} className="px-4 py-2 bg-blue-800 text-white rounded-md text-sm">
                {skill}
              </span>
            ))}

            {isEditing && (
              <div className="flex gap-2 items-center">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add new skill"
                  className="border-[#d8d8d8]"
                />
                <Button
                  onClick={handleAddSkill}
                  className="bg-blue-800 text-white hover:bg-[#143d65] h-10 w-10 p-0 flex items-center justify-center"
                >
                  <Plus size={16} />
                </Button>
              </div>
            )}

            {!isEditing && (
              <Button className="px-4 py-2 border border-[#d8d8d8] bg-white text-[#232636] hover:bg-[#f5f5f5] rounded-md text-sm flex items-center gap-1">
                <Plus size={16} />
                New Skill
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">My Goals</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {profileData.goals?.map((goal, index) => (
              <span key={index} className="px-4 py-2 bg-blue-800 text-white rounded-md text-sm">
                {goal}
              </span>
            ))}

            {isEditing && (
              <div className="flex gap-2 items-center">
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add new goal"
                  className="border-[#d8d8d8]"
                />
                <Button
                  onClick={handleAddGoal}
                  className="bg-blue-800 text-white hover:bg-[#143d65] h-10 w-10 p-0 flex items-center justify-center"
                >
                  <Plus size={16} />
                </Button>
              </div>
            )}

            {!isEditing && (
              <Button className="px-4 py-2 border border-[#d8d8d8] bg-white text-[#232636] hover:bg-[#f5f5f5] rounded-md text-sm flex items-center gap-1">
                <Plus size={16} />
                New Goal
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">Indie Score</h2>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="text-[#fbb236]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" stroke="#fbb236" strokeWidth="2" fill="#fbb236" fillOpacity="0.2" />
                  <path d="M12 8V12L15 14" stroke="#fbb236" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-[#676767]">Coins Earned</div>
                <div className="text-2xl font-bold text-[#232636]">32</div>
              </div>
            </div>

            <div className="bg-[#f9fbff] p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">₹1 = </span>
                <span className="flex items-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" stroke="#fbb236" strokeWidth="2" fill="#fbb236" fillOpacity="0.2" />
                  </svg>
                  <span className="ml-1">1 Indie Coin</span>
                </span>
              </div>
              <div className="text-sm text-[#676767]">Example: If you spend ₹100, then you earn ₹100 FlexCoins</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-[#d8d8d8]">
              <h3 className="text-lg font-semibold text-[#232636] mb-4">Pie Chart</h3>
              <div className="h-64 relative">
                <Doughnut data={chartData1} options={chartOptions} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl font-bold">40</div>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#a3d7ff]"></div>
                  <span className="text-sm">Value 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#fff0cc]"></div>
                  <span className="text-sm">Value 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#cceeed]"></div>
                  <span className="text-sm">Value 3</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#d8d8d8]">
              <h3 className="text-lg font-semibold text-[#232636] mb-4">Pie Chart</h3>
              <div className="h-64 relative">
                <Doughnut data={chartData2} options={chartOptions} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl font-bold">40</div>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#a3d7ff]"></div>
                  <span className="text-sm">Value 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#fff0cc]"></div>
                  <span className="text-sm">Value 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#cceeed]"></div>
                  <span className="text-sm">Value 3</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

export default Profile







