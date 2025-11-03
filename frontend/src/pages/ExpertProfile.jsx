import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Loader } from '../components/ui/loader';
import { Plus, Upload, Pencil, Link as LinkIcon, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
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
    targetAudience: [],
    links: [],
    profilePicture: "/placeholder-expert.png",
    completedSteps: 0,
    totalSteps: 7,
    status: "not requested"
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
  const [newLink, setNewLink] = useState({ name: "", url: "" });
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [isEditingCertification, setIsEditingCertification] = useState(false);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [selectedCertificateFile, setSelectedCertificateFile] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    title: "",
    email: "",
    phone: ""
  });
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);

  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [approvalRequirements, setApprovalRequirements] = useState({
    basicInfo: false,
    profilePicture: false,
    links: false,
    expertise: false,
    targetAudience: false,
    experience: false,
  });

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
    if (expertData) {
      console.log("Expert status from API:", expertData.status);
      setProfileData(prev => ({
        ...prev,
        name: expertData.name || "",
        email: expertData.email || "",
        phone: expertData.phone || "",
        title: expertData.title || "",
        expertise: expertData.expertise || [],
        targetAudience: expertData.targetAudience || [],
        links: expertData.links || [],
        profilePicture: expertData.profilePicture || "/placeholder-expert.png",
        completedSteps: expertData.profileCompletion || 0,
        totalSteps: 7,
        education: expertData.education || [],
        experience: expertData.experience || [],
        certifications: expertData.certifications || [],
        status: expertData.status || "not requested"
      }));
      if (expertData) {
        setApprovalRequirements({
          basicInfo: !!expertData.name && !!expertData.email && !!expertData.title && !!expertData.phone,
          profilePicture: expertData.profilePicture && expertData.profilePicture !== "/placeholder-expert.png",
          links: Array.isArray(expertData.links) && expertData.links.length > 0,
          expertise: Array.isArray(expertData.expertise) && expertData.expertise.length > 0,
          targetAudience: Array.isArray(expertData.targetAudience) && expertData.targetAudience.length > 0,
          experience: Array.isArray(expertData.experience) && expertData.experience.length > 0,
        });
      }
    }
  }, [expertData]);

  useEffect(() => {
    if (profileData) {
      setApprovalRequirements({
        basicInfo: !!profileData.name && !!profileData.email && !!profileData.title && !!profileData.phone,
        profilePicture: profileData.profilePicture && profileData.profilePicture !== "/placeholder-expert.png",
        links: Array.isArray(profileData.links) && profileData.links.length > 0,
        expertise: Array.isArray(profileData.expertise) && profileData.expertise.length > 0,
        targetAudience: Array.isArray(profileData.targetAudience) && profileData.targetAudience.length > 0,
        experience: Array.isArray(profileData.experience) && profileData.experience.length > 0,
      });
    }
  }, [profileData]);

  const handleEditField = (field) => {
    setEditingField(field);
    // Set the current value in editValues when starting to edit
    setEditValues(prev => ({
      ...prev,
      [field]: profileData[field]
    }));
  };

  const handleSaveField = async (field) => {
    try {
      setLoading(true);
      let data = {};
      switch (field) {
        case 'name':
          data = { name: editValues.name };
          break;
        case 'title':
          data = { title: editValues.title };
          break;
        case 'email':
          data = { email: editValues.email };
          break;
        case 'phone':
          data = { phoneNo: editValues.phone }; // Map 'phone' from frontend to 'phoneNo' for backend
          break;
        default:
          break;
      }
      const response = await axiosInstance.put('/expert/update', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        toast.success(`${field} updated successfully`);
        setEditingField(null);
        
        // Update local state to reflect the changes
        setProfileData(prev => ({
          ...prev,
          [field]: editValues[field]
        }));
        
        // Refresh expert data to ensure everything is in sync
        fetchExpertData();
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
        targetAudience: profileData.targetAudience
      };
      
      const response = await axiosInstance.put('/expert/update', payload);
      
      if (response.status === 200) {
        setErrorMessage("");
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

const renderBasicInfoField = (field, label, type = "text", placeholder = "") => {
  const isEditable =
    field === "email" || field === "phone" ? !profileData[field] : true;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-[#232636] mb-1">
        {label}
      </label>

      {editingField === field ? (
        // ✏️ Edit mode
        <div>
          <Input
            type={type}
            value={editValues[field]}
            placeholder={placeholder}
            onChange={(e) =>
              setEditValues((prev) => ({ ...prev, [field]: e.target.value }))
            }
            className="w-full border-[#d8d8d8]"
            disabled={!isEditable}
          />
          {isEditable && (
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => handleSaveField(field)}
                className="bg-blue-800 p-2 rounded-md text-white hover:bg-[#143d65]"
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setEditingField(null);
                  setEditValues((prev) => ({
                    ...prev,
                    [field]: profileData[field],
                  }));
                }}
                className="bg-gray-300 p-2 rounded-md text-black hover:bg-gray-400"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      ) : (
        // 👁️ View mode
        <div className="relative">
          <Input
            value={profileData[field] || ""}
            readOnly
            placeholder={placeholder}
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

  const handleAddLink = async () => {
    if (!newLink.name || !newLink.url) {
      setErrorMessage("Please fill both name and URL fields");
      return;
    }
    
    try {
      new URL(newLink.url);
    } catch (error) {
      setErrorMessage("Please enter a valid URL (include http:// or https://)");
      return;
    }
    
    try {
      const updatedLinks = [...profileData.links, newLink];
      
      const response = await axiosInstance.patch('/expert/update-links', 
        { links: updatedLinks },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          links: updatedLinks
        }));
        
        useExpertStore.getState().updateLinks(updatedLinks);
        
        setNewLink({ name: "", url: "" });
        setIsEditingLink(false);
        toast.success('Link added successfully');
      }
    } catch (error) {
      console.error('Failed to add link:', error);
      setErrorMessage(error.response?.data?.message || "Failed to add link");
    }
  };

  const handleRemoveLink = async (index) => {
    try {
      const updatedLinks = profileData.links.filter((_, i) => i !== index);
      
      const response = await axiosInstance.patch('/expert/update-links', 
        { links: updatedLinks },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          links: updatedLinks
        }));
        
        useExpertStore.getState().updateLinks(updatedLinks);
        
        toast.success('Link removed successfully');
      }
    } catch (error) {
      console.error('Failed to remove link:', error);
      setErrorMessage(error.response?.data?.message || "Failed to remove link");
    }
  };

  const handleCertificateFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrorMessage("Please upload a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
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
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setErrorMessage("Failed to logout. Please try again.");
    }
  };

  const handleRequestApproval = async () => {
    try {
      setIsSubmittingApproval(true);
      
      const { basicInfo, profilePicture, links, expertise, targetAudience, experience } = approvalRequirements;
      if (!basicInfo || !profilePicture || !links || !expertise || !targetAudience || !experience) {
        setErrorMessage("Please complete all required profile sections before requesting approval");
        setIsSubmittingApproval(false);
        return;
      }

      const response = await axiosInstance.post('/expert/request-approval');
      
      if (response.status === 200) {
        toast.success("Approval request submitted successfully!");
        setProfileData(prev => ({
          ...prev,
          status: "pending"
        }));
        fetchExpertData();
      }
    } catch (error) {
      console.error("Error requesting approval:", error);
      setErrorMessage(error.response?.data?.message || "Failed to submit approval request");
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  const canRequestApproval = () => {
    const statusAllowsRequest = profileData.status !== "approved" && profileData.status !== "pending";
    const allRequirementsMet = Object.values(approvalRequirements).every(requirement => requirement);
    return statusAllowsRequest && allRequirementsMet;
  };

  const completionPercentage = (profileData.completedSteps / profileData.totalSteps) * 100;

  if (loading || !authData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <ToastContainer position="top-right" autoClose={3000} />
      <ErrorPopup message={errorMessage} onClose={() => setErrorMessage("")} />
      <Header className="sticky top-0 z-50 bg-white shadow-md" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <div className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
            profileData.status === "approved" 
              ? "bg-green-100 text-green-800" 
              : profileData.status === "pending" 
                ? "bg-yellow-100 text-yellow-800"
                : profileData.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
          }`}>
            {profileData.status === "approved" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-medium">
              Onboarding Status: {profileData.status === "not requested" 
                ? "Not Requested" 
                : profileData.status.charAt(0).toUpperCase() + profileData.status.slice(1)}
            </span>
            {profileData.status === "rejected" && expertData.rejectionReason && (
              <span className="ml-2 text-red-700">
                Reason: {expertData.rejectionReason}
              </span>
            )}
          </div>
        </div>

        <Card id="basic-info" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-6">My Profile</h2>

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
                {renderBasicInfoField('name', 'Full Name', 'text', 'Enter your full name')}
                {renderBasicInfoField('title', 'Profile Headline', 'text', 'eg- VP at ABC Company | Data enthusiast | Coach @abc')}
                {renderBasicInfoField('email', 'Email', 'email', 'Enter your email address')}
                {renderBasicInfoField('phone', 'Contact Number', 'tel', 'Enter your phone number')}
              </form>
            </div>
          </div>
        </Card>

        <Card id="links" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">My Social & Professional Links</h2>
          <div className="space-y-4">
            {profileData.links?.length > 0 ? (
              <div className="space-y-2 mb-4">
                {profileData.links.map((link, index) => (
                  <div key={`link-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <LinkIcon size={16} className="text-blue-600" />
                      <span className="font-medium">{link.name}:</span>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline truncate max-w-xs sm:max-w-md"
                      >
                        {link.url}
                      </a>
                    </div>
                    <button 
                      onClick={() => handleRemoveLink(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic mb-4">No links added yet. Share any links where we can explore your work or achievements (LinkedIn/ Resume/Portfolio ,etc)</p>
            )}

            {isEditingLink ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Link Name (e.g., LinkedIn, Portfolio, GitHub)"
                    value={newLink.name}
                    onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="URL (include http:// or https://)"
                    value={newLink.url}
                    onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddLink}
                    className="bg-blue-800 p-2 rounded-md text-white hover:bg-[#143d65]"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setNewLink({ name: "", url: "" });
                      setIsEditingLink(false);
                    }}
                    className="bg-gray-300 p-2 rounded-md text-black hover:bg-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditingLink(true)}
                className="w-full border border-dashed border-gray-300 p-4 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Link
              </Button>
            )}
          </div>
        </Card>

        <Card id="expertise" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">My Expertise</h2>
          <p className="text-gray-500 italic mb-4">List all topics or domains where you offer guidance, mentorship, or coaching</p>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 mb-4">
              {profileData.expertise?.map((exp, index) => (
                <span key={`expertise-${index}-${exp}`} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium flex items-center gap-2 border border-blue-200 shadow-sm">
                  {exp}
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
                    e.target.value = ''; 
                  }
                }}
                className="flex-grow border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="">+ Add Expertise</option>
                {[
                  'Software Development',
                  'AI/ML',
                  'Data Science',
                  'Cybersecurity',
                  'Cloud Computing & DevOps',
                  'Product Management',
                  'Psychology & Therapy',
                  'Business Analysis',
                  'Strategy & Operations',
                  'Data Analysis',
                  'Chartered Accountancy (CA)',
                  'CFA',
                  'Investment Banking',
                  'Financial Planning & Analysis',
                  'FinTech Roles',
                  'Corporate & Criminal Law',
                  'Company Secretary',
                  'Digital Marketing',
                  'SEO',
                  'Graphic Designing',
                  'PR & Corporate Communication',
                  'Content Writing & Copywriting',
                  'Growth Marketing',
                  'Industrial Design',
                  'Robotics & Mechatronics',
                  'UI/UX & Interaction Design',
                  'Fashion Design',
                  'Interior & Spatial Design',
                  'Animation & Illustration',
                  'Fine Arts & Applied Arts',
                  'Architecture',
                  'Public Policy & Governance',
                  'Exam Prep Mentorship - UPSC',
                  'Exam Prep Mentorship - CUET',
                  'Exam Prep Mentorship - NET',
                  'Exam Prep Mentorship - JEE',
                  'Exam Prep Mentorship - GMAT/GRE',
                  'Exam Prep Mentorship - Banking and other govt exams',
                  'Exam Prep Mentorship - NET/JRF',
                  'Journalism (Print & Digital)',
                  'Content Creation (YouTube, Podcasting)',
                  'Film & Video Production',
                  'Advertising & Copywriting',
                  'OTT & New Media',
                  'Business Growth',
                  'Program Management',
                  'Hotel Management',
                  'Culinary Arts & Bakery',
                  'Tourism & Travel',
                  'Aviation & Cabin Crew',
                  'Event Management',
                  'Make Up Artist',
                  'Dietitian/Nutrition',
                  'Fitness Training',
                  'Career Discovery/Career Counselling',
                  'Study Abroad Guidance',
                  'Soft Skills & Interview Prep',
                  'Resume Building & LinkedIn & Job search',
                  'PHD admission mentorship',
                  'Stream Selection'
                ].filter(exp => !profileData.expertise?.includes(exp))
                .map(exp => (
                  <option key={exp} value={exp}>
                    {exp}
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

        <Card id="target-audience" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">My Audience</h2>
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
                      e.target.value = ''; 
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 appearance-none hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue=""
                >
                  <option value="">+ Add Target Audience</option>
                  {[
                    'I am in Class 9th or 10th',
                    'I am in Class 11th or 12th',
                    'I am doing my graduation',
                    'I am pursuing masters', 
                    'I am working currently'
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
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">My Academic Background</h2>
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
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">My Experience</h2>
          <p className="text-gray-500 italic mb-4">Full time roles/ Part time & freelance projects/ Volunteering role/ Internships</p>
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
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">My Licensces and Certifications</h2>
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

        {profileData.status !== "approved" && profileData.status !== "pending" && (
          <Card className="p-6 mb-8 border-2 border-blue-200 shadow-lg">
            <h2 className="text-2xl font-semibold text-[#232636] mb-4">Request to Become an Approved Expert</h2>
            <p className="mb-4 text-gray-600">
              To start offering your services to students, you'll need to request approval from our admin team.
              Please complete all required profile sections to enable the request button.
            </p>
            
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  approvalRequirements.basicInfo ? "bg-green-500" : "bg-gray-300"
                }`}>
                  {approvalRequirements.basicInfo && <CheckCircle size={14} className="text-white" />}
                </div>
                <span className={approvalRequirements.basicInfo ? "text-green-700" : "text-gray-500"}>
                  Basic Information (Name, Email, Title, Phone)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  approvalRequirements.profilePicture ? "bg-green-500" : "bg-gray-300"
                }`}>
                  {approvalRequirements.profilePicture && <CheckCircle size={14} className="text-white" />}
                </div>
                <span className={approvalRequirements.profilePicture ? "text-green-700" : "text-gray-500"}>
                  Profile Picture
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  approvalRequirements.links ? "bg-green-500" : "bg-gray-300"
                }`}>
                  {approvalRequirements.links && <CheckCircle size={14} className="text-white" />}
                </div>
                <span className={approvalRequirements.links ? "text-green-700" : "text-gray-500"}>
                  At least one Social or Professional Link
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  approvalRequirements.expertise ? "bg-green-500" : "bg-gray-300"
                }`}>
                  {approvalRequirements.expertise && <CheckCircle size={14} className="text-white" />}
                </div>
                <span className={approvalRequirements.expertise ? "text-green-700" : "text-gray-500"}>
                  Areas of Expertise
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  approvalRequirements.targetAudience ? "bg-green-500" : "bg-gray-300"
                }`}>
                  {approvalRequirements.targetAudience && <CheckCircle size={14} className="text-white" />}
                </div>
                <span className={approvalRequirements.targetAudience ? "text-green-700" : "text-gray-500"}>
                  Target Audience
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  approvalRequirements.experience ? "bg-green-500" : "bg-gray-300"
                }`}>
                  {approvalRequirements.experience && <CheckCircle size={14} className="text-white" />}
                </div>
                <span className={approvalRequirements.experience ? "text-green-700" : "text-gray-500"}>
                  Professional Experience
                </span>
              </div>
            </div>
            
            <Button
              onClick={handleRequestApproval}
              disabled={!canRequestApproval() || isSubmittingApproval}
              className={`w-full py-3 ${
                canRequestApproval() 
                  ? "bg-blue-800 text-white hover:bg-[#143d65]" 
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {isSubmittingApproval ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting...
                </span>
              ) : (
                "Request Approval"
              )}
            </Button>
          </Card>
        )}

        <div className="mb-4">
          <div className="h-2 w-full bg-[#f5f5f5] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#143d65]" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="text-sm text-[#676767] mt-1 flex justify-between">
            <span>
              Profile completion: {profileData.completedSteps}/{profileData.totalSteps} steps completed
            </span>
            {profileData.completedSteps < profileData.totalSteps && (
              <span className="text-blue-600">
                Complete your profile to increase visibility to students
              </span>
            )}
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
        currentPicture={expertData?.profilePicture || "/placeholder-expert.png"}
        onSave={handleUpdateProfilePicture}
      />

      <Footer />
    </div>
  );
}

export default ExpertProfile;