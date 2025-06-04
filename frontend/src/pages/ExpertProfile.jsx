import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Plus, Upload, Pencil } from 'lucide-react';
import { ErrorPopup } from '../components/ui/error-popup';
import axiosInstance from '../config/axios.config';
import useExpertStore from "../store/expertStore";
import useExpertSessionStore from "../store/expertSessionsStore";
import useExpertCourseStore from "../store/expertCoursesStore";
import useExpertCohortStore from "../store/expertCohortsStore";
import useUserTypeStore from '../store/userTypeStore';
import ProfilePictureModal from "../components/modals/ProfilePictureModal";
import checkAuth from '../utils/checkAuth';

function ExpertProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { expertData, fetchExpertData } = useExpertStore();
  const { userType, setUserType } = useUserTypeStore();
  const resetExpertStore = useExpertStore((state) => state.reset);
  const resetSessionStore = useExpertSessionStore((state) => state.reset);
  const resetCourseStore = useExpertCourseStore((state) => state.reset);
  const resetCohortStore = useExpertCohortStore((state) => state.reset);
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    expertise: [],
    education: [],
    experience: [],
    certifications: [],
    industries: [],
    targetAudience: [],
    profilePicture: "/placeholder-user.jpg",
    completedSteps: 0,
    totalSteps: 8
  });

  const [editingField, setEditingField] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newExpertise, setNewExpertise] = useState("");
  const [newEducation, setNewEducation] = useState({ 
    degree: "", 
    institution: "", 
    field: "",
    startYear: "",
    endYear: "",
    description: "" 
  });
  const [newExperience, setNewExperience] = useState({ title: "", company: "", duration: "", description: "" });
  const [newCertification, setNewCertification] = useState({ name: "", issuer: "" });
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [isEditingCertification, setIsEditingCertification] = useState(false);
  const [selectedCertificateFile, setSelectedCertificateFile] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    title: "",
    email: "",
    phone: ""
  });
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);
  const [showIndustries, setShowIndustries] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      const data = await checkAuth(setUserType, setLoading);
      setAuthData(data);
    };
    handleAuth();
  }, [setUserType]);

  useEffect(() => {
    if (authData) {
      if (userType === "student") {
        navigate("/dashboard");
        return;
      } else if (userType === "not_signed_in") {
        navigate("/signup");
        return;
      }
      fetchExpertData();
    }
  }, [userType, navigate, fetchExpertData, authData]);

  useEffect(() => {
    // console.log("Expert Data:", expertData);
    if (expertData) {
      setProfileData(prev => ({
        ...prev,
        name: expertData.name || "",
        email: expertData.email || "",
        phone: expertData.phoneNo || "",
        title: expertData.title || "",
        expertise: expertData.expertise || [],
        industries: expertData.industries || [], // Ensure industries are properly set
        targetAudience: expertData.targetAudience || [],
        profilePicture: expertData.profilePicture || "/placeholder-user.jpg",
        completedSteps: expertData.profileCompletion || 0,
        totalSteps: 8,
        education: expertData.education || [],
        experience: expertData.experience || [],
        certifications: expertData.certifications || []
      }));
    }
  }, [expertData]);

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleSaveField = async (field) => {
    try {
      setLoading(true);
      let data = {};

      switch (field) {
        // ...existing code...
      }

      const response = await axiosInstance.put('/expert/update', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        toast.success(`${field} updated successfully`);
        setEditingField(null);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post('/expert/profile-picture', formData, {
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
        // Update the store with new profile picture
        useExpertStore.getState().updateProfilePicture(response.data.profilePicture);
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update profile picture');
    }
  };

  const handleSaveAll = async () => {
    try {
      const payload = {
        expertise: profileData.expertise,
        industries: profileData.industries,
        targetAudience: profileData.targetAudience
      };
      
      const response = await axiosInstance.put('/expert/update', payload);
      
      if (response.status === 200) {
        setErrorMessage("");
        // Show success message or toast here if you have one
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      setErrorMessage(error.response?.data?.message || "Failed to save changes");
    }
  };

  const handleExpertiseChange = (expertise) => {
    setProfileData((prevData) => ({
      ...prevData,
      expertise: Array.isArray(expertise) ? expertise : [],
    }));
  };

  const handleRemoveExpertise = (expertiseToRemove) => {
    setProfileData((prevData) => ({
      ...prevData,
      expertise: prevData.expertise.filter((exp) => exp !== expertiseToRemove),
    }));
  };

  const renderBasicInfoField = (field, label, type = "text") => {
    // console.log("Rendering field:", field, "with value:", profileData[field]);
    const isEditable = field === 'email' || field === 'phone' ? !profileData[field] : true;
    
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-[#232636] mb-1">{label}</label>
        {editingField === field ? (
          <div>
            <Input
              type={type}
              value={editValues[field]}
              onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
              className="w-full border-[#d8d8d8]"
              disabled={!isEditable}
            />
            {isEditable && (
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => handleSaveField(field)}
                  className="bg-blue-800 text-white hover:bg-[#143d65]"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setEditingField(null);
                    setEditValues(prev => ({ ...prev, [field]: profileData[field] }));
                  }}
                  className="bg-gray-300 text-black hover:bg-gray-400"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <Input
              value={profileData[field] || ""}
              readOnly
              className="w-full border-[#d8d8d8] bg-[#f9fbff] pr-10"
            />
            {isEditable && (
              <Button
                onClick={() => handleEditField(field)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#003265] bg-transparent hover:bg-[#f5f5f5] p-1"
              >
                <Pencil size={16} />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleAddEducation = async () => {
    if (!newEducation.degree || !newEducation.institution || !newEducation.field || !newEducation.startYear || !newEducation.endYear) {
      setErrorMessage("Please fill all required education fields");
      return;
    }

    try {
      const response = await axiosInstance.post('/expert/education', newEducation);
      
      if (response.status === 201) {
        setProfileData(prev => ({
          ...prev,
          education: [...prev.education, response.data.education]
        }));
        setNewEducation({ 
          degree: "", 
          institution: "", 
          field: "",
          startYear: "",
          endYear: "",
          description: "" 
        });
        setIsEditingEducation(false);
        fetchExpertData();
      }
    } catch (error) {
      console.error('Failed to add education:', error);
      setErrorMessage(error.response?.data?.message || "Failed to add education");
    }
  };

  const handleAddExperience = async () => {
    if (!newExperience.title || !newExperience.company || !newExperience.duration) {
      setErrorMessage("Please fill all required experience fields");
      return;
    }

    try {
      const response = await axiosInstance.post('/expert/experience', newExperience);
      
      if (response.status === 201) {
        setProfileData(prev => ({
          ...prev,
          experience: [...prev.experience, response.data.experience]
        }));
        setNewExperience({ title: "", company: "", duration: "", description: "" });
        setIsEditingExperience(false);
        fetchExpertData();
      }
    } catch (error) {
      console.error('Failed to add experience:', error);
      setErrorMessage(error.response?.data?.message || "Failed to add experience");
    }
  };

  const handleCertificateFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrorMessage("Please upload a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {  // 5MB
        setErrorMessage("File size should be less than 5MB");
        return;
      }
      setSelectedCertificateFile(file);
    }
  };

  const handleAddCertification = async () => {
    if (!newCertification.name || !newCertification.issuer || !selectedCertificateFile) {
      setErrorMessage("Please fill all certification fields and upload a PDF certificate");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newCertification.name);
      formData.append('issuer', newCertification.issuer);
      formData.append('certificate', selectedCertificateFile);

      const response = await axiosInstance.post('/expert/certification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 201) {
        setProfileData(prev => ({
          ...prev,
          certifications: [...prev.certifications, response.data.certification]
        }));
        setNewCertification({ name: "", issuer: "" });
        setSelectedCertificateFile(null);
        setIsEditingCertification(false);
        // Refresh expert data in store
        fetchExpertData();
      }
    } catch (error) {
      console.error('Failed to add certification:', error);
      setErrorMessage(error.response?.data?.message || "Failed to add certification");
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/expert/auth/logout");
      setUserType("not_signed_in");
      console.log(userType)
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setErrorMessage("Failed to logout. Please try again.");
    }
  };

  const completionPercentage = (profileData.completedSteps / profileData.totalSteps) * 100;

  const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Engineering',
    'Marketing',
    'Design',
    'Business Management',
    'Data Science',
    'Research & Development',
    'Manufacturing',
    'Consulting',
    'Law',
    'Media & Entertainment',
    'Architecture',
    'Life Sciences'
  ];

  const handleIndustrySelect = (industry) => {
    if (!profileData.industries.includes(industry)) {
      const updatedIndustries = [...profileData.industries, industry];
      setProfileData((prev) => ({
        ...prev,
        industries: updatedIndustries,
      }));
      // Update the store
      useExpertStore.getState().updateIndustries(updatedIndustries);
    }
    setShowIndustries(false);
  };

  const handleIndustryRemove = (industry) => {
    const updatedIndustries = profileData.industries.filter((ind) => ind !== industry);
    setProfileData((prev) => ({
      ...prev,
      industries: updatedIndustries,
    }));
    // Update the store
    useExpertStore.getState().updateIndustries(updatedIndustries);
  };

  if (loading || !authData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <ToastContainer position="top-right" autoClose={3000} />
      <ErrorPopup message={errorMessage} onClose={() => setErrorMessage("")} />
      <Header className="sticky top-0 z-50 bg-white shadow-md" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Card id="basic-info" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-6">Basic Information</h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setIsProfilePictureModalOpen(true)}>
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button 
                onClick={() => setIsProfilePictureModalOpen(true)}
                className="bg-blue-800 text-white hover:bg-[#143d65] px-4 py-2"
              >
                Change Photo
              </Button>
            </div>

            <div className="md:w-3/4">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderBasicInfoField('name', 'Name')}
                {renderBasicInfoField('title', 'Title')}
                {renderBasicInfoField('email', 'Email', 'email')}
                {renderBasicInfoField('phone', 'Phone', 'tel')}
              </form>
            </div>
          </div>
        </Card>

        <Card id="expertise" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">My Expertise</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 mb-4">
              {profileData.expertise?.map((exp, index) => (
                <span key={`expertise-${index}-${exp}`} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium flex items-center gap-2 border border-blue-200 shadow-sm">
                  {exp.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  <button 
                    onClick={() => handleRemoveExpertise(exp)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    const newExpertise = [...(profileData.expertise || [])];
                    if (!newExpertise.includes(e.target.value)) {
                      handleExpertiseChange([...newExpertise, e.target.value]);
                    }
                    e.target.value = ''; // Reset selection
                  }
                }}
                className="flex-grow border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="">+ Add Expertise</option>
                {[
                  'stream_selection',
                  'career_counseling',
                  'competitive_exams',
                  'study_abroad',
                  'resume_interview',
                  'entrepreneurship',
                  'higher_education',
                  'career_transition',
                  'industry_specific'
                ].filter(exp => !profileData.expertise?.includes(exp))
                .map(exp => (
                  <option key={exp} value={exp}>
                    {exp.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
              <Button
                onClick={async () => {
                  try {
                    const response = await axiosInstance.patch('/expert/update-expertise', 
                      { expertise: profileData.expertise }
                    );
                    if (response.status === 200) {
                      toast.success('Expertise updated successfully');
                    }
                  } catch (error) {
                    console.error('Error updating expertise:', error);
                    toast.error('Failed to update expertise');
                  }
                }}
                className="bg-blue-800 text-white hover:bg-[#143d65] px-4 py-2.5 rounded-lg"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>

        <Card id="industries" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">Industries</h2>
          <div className="space-y-4">
            <div className="mb-2 flex flex-wrap gap-2">
              {profileData.industries?.map((industry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                >
                  <span>{industry}</span>
                  <button
                    onClick={() => handleIndustryRemove(industry)}
                    className="ml-1 rounded-full hover:bg-blue-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="relative w-full">
              <button
                onClick={() => setShowIndustries(!showIndustries)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-left hover:bg-gray-50 focus:border-blue-500 focus:outline-none"
              >
                <span className="text-gray-700">+ Add Industry</span>
                <svg
                  className={`h-5 w-5 transition-transform ${showIndustries ? 'rotate-180' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {showIndustries && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {industryOptions.map((industry, index) => (
                    <button
                      key={index}
                      onClick={() => handleIndustrySelect(industry)}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                      disabled={profileData.industries.includes(industry)}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={async () => {
                try {
                  const response = await axiosInstance.patch('/expert/update-industries', 
                    { industries: profileData.industries }
                  );
                  if (response.status === 200) {
                    toast.success('Industries updated successfully');
                  }
                } catch (error) {
                  console.error('Error updating industries:', error);
                  toast.error('Failed to update industries');
                }
              }}
              className="bg-blue-800 text-white hover:bg-[#143d65] px-4"
            >
              Save Changes
            </Button>
          </div>
        </Card>

        <Card id="target-audience" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">Target Audience</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {profileData.targetAudience?.map((audience, index) => (
                <span 
                  key={`target-audience-tag-${index}-${audience}`} 
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm flex items-center gap-2 border border-green-200 shadow-sm"
                >
                  {audience}
                  <button 
                    onClick={() => {
                      const newAudiences = profileData.targetAudience.filter(a => a !== audience);
                      setProfileData(prev => ({
                        ...prev,
                        targetAudience: newAudiences
                      }));
                    }}
                    className="text-green-600 hover:text-green-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative flex-grow">
                <select
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    if (selectedValue) {
                      setProfileData(prev => ({
                        ...prev,
                        targetAudience: [...(prev.targetAudience || []), selectedValue]
                      }));
                      e.target.value = ''; // Reset selection
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 appearance-none hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue=""
                >
                  <option value="">+ Add Target Audience</option>
                  {[
                    'High School Student (Class 11-12)',
                    'Secondary School Student (Class 9-10)',
                    'Undergraduate Student',
                    'Postgraduate Student', 
                    'Working Professional'
                  ].filter(audience => !profileData.targetAudience?.includes(audience))
                  .map((audience, index) => (
                    <option key={`target-audience-option-${index}-${audience}`} value={audience}>
                      {audience}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              <Button
                onClick={async () => {
                  try {
                    const response = await axiosInstance.patch('/expert/update-target-audience', 
                      { targetAudience: profileData.targetAudience }
                    );
                    if (response.status === 200) {
                      toast.success('Target audience updated successfully');
                    }
                  } catch (error) {
                    console.error('Error updating target audience:', error);
                    toast.error('Failed to update target audience');
                  }
                }}
                className="bg-blue-800 text-white hover:bg-[#143d65] px-4 py-2.5 rounded-lg"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>

        <Card id="education" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">Education</h2>
          <div className="space-y-4">
            {profileData.education?.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
              </div>
            ))}

            {isEditingEducation ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Degree"
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                  />
                  <Input
                    placeholder="Institution"
                    value={newEducation.institution}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                  />
                  <Input
                    placeholder="Field of Study"
                    value={newEducation.field}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Start Year"
                    value={newEducation.startYear}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                  />
                  <Input
                    type="number"
                    placeholder="End Year"
                    value={newEducation.endYear}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, endYear: parseInt(e.target.value) }))}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newEducation.description}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddEducation}
                    className="bg-blue-800 text-white hover:bg-[#143d65]"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setNewEducation({ degree: "", institution: "", field: "", startYear: "", endYear: "", description: "" });
                      setIsEditingEducation(false);
                    }}
                    className="bg-gray-300 text-black hover:bg-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditingEducation(true)}
                className="w-full border border-dashed border-gray-300 p-4 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Education
              </Button>
            )}
          </div>
        </Card>

        <Card id="experience" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">Experience</h2>
          <div className="space-y-4">
            {profileData.experience?.map((exp) => (
              <div key={`exp-${exp.company}-${exp.title}`} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{exp.title}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.duration}</p>
                {exp.description && (
                  <p className="text-gray-600 mt-2">{exp.description}</p>
                )}
              </div>
            ))}

            {isEditingExperience ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Title"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Company"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                  />
                  <Input
                    placeholder="Duration"
                    value={newExperience.duration}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, duration: e.target.value }))}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newExperience.description}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddExperience}
                    className="bg-blue-800 text-white hover:bg-[#143d65]"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setNewExperience({ title: "", company: "", duration: "", description: "" });
                      setIsEditingExperience(false);
                    }}
                    className="bg-gray-300 text-black hover:bg-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditingExperience(true)}
                className="w-full border border-dashed border-gray-300 p-4 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Experience
              </Button>
            )}
          </div>
        </Card>

        <Card id="certifications" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">Certifications</h2>
          <div className="space-y-4">
            {profileData.certifications?.map((cert, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{cert.name}</h3>
                <p className="text-gray-600">{cert.issuer}</p>
                <p className="text-sm text-gray-500">{cert.year}</p>
                {cert.certificateFile?.url && (
                  <a
                    href={cert.certificateFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-blue-800 text-white text-sm rounded hover:bg-[#143d65] transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    View Certificate
                  </a>
                )}
              </div>
            ))}

            {isEditingCertification ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Certification Name"
                    value={newCertification.name}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Issuing Organization"
                    value={newCertification.issuer}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
                  />
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate (PDF only)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleCertificateFileChange}
                        className="hidden"
                        id="certificate-upload"
                      />
                      <label
                        htmlFor="certificate-upload"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <Upload size={16} />
                        {selectedCertificateFile ? selectedCertificateFile.name : "Choose PDF file"}
                      </label>
                      {selectedCertificateFile && (
                        <span className="text-sm text-green-600">File selected</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddCertification}
                    className="bg-blue-800 text-white hover:bg-[#143d65]"
                    disabled={!selectedCertificateFile}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setNewCertification({ name: "", issuer: "" });
                      setSelectedCertificateFile(null);
                      setIsEditingCertification(false);
                    }}
                    className="bg-gray-300 text-black hover:bg-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditingCertification(true)}
                className="w-full border border-dashed border-gray-300 p-4 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Certification
              </Button>
            )}
          </div>
        </Card>

        <div className="mb-4">
          <div className="h-2 w-full bg-[#f5f5f5] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#143d65]" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="text-sm text-[#676767] mt-1">
            Profile completion: {profileData.completedSteps}/{profileData.totalSteps} steps completed
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </main>

      <ProfilePictureModal
        isOpen={isProfilePictureModalOpen}
        onClose={() => setIsProfilePictureModalOpen(false)}
        currentPicture={expertData?.profilePicture || "/placeholder-user.jpg"}
        onSave={handleUpdateProfilePicture}
      />

      <Footer />
    </div>
  );
}

export default ExpertProfile;