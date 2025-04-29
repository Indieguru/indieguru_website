import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Plus, Pencil } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import "chart.js/auto";
import InputBox from '../components/util/InputBox';
import { ErrorPopup } from '../components/ui/error-popup';
import axiosInstance from '../config/axios.config';

function ExpertProfile() {
  const location = useLocation();
  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    expertise: [],
    education: [],
    experience: [],
    certifications: [],
    avatar: "/imagecopy.png",
    completedSteps: 0,
    totalSteps: 8
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [newExpertise, setNewExpertise] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newEducation, setNewEducation] = useState({ degree: "", institution: "", year: "" });
  const [newExperience, setNewExperience] = useState({ title: "", company: "", duration: "", description: "" });
  const [newCertification, setNewCertification] = useState({ name: "", issuer: "", year: "" });
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [isEditingCertification, setIsEditingCertification] = useState(false);

  useEffect(() => {
    fetchExpertProfile();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const fetchExpertProfile = async () => {
    try {
      const response = await axiosInstance.get('/expert/profile');
      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          ...response.data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setErrorMessage("Failed to fetch profile data");
    }
  };

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleSaveField = async (field, value) => {
    try {
      const response = await axiosInstance.put('/expert/update', {
        [field]: value
      });
      
      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          [field]: value
        }));
        setEditingField(null);
      }
    } catch (error) {
      console.error('Failed to update field:', error);
      setErrorMessage("Failed to update field");
    }
  };

  const handleAddExpertise = async () => {
    if (newExpertise.trim() === "") return;
    
    const expertiseToAdd = newExpertise.trim();
    if (profileData.expertise.some(exp => exp.toLowerCase() === expertiseToAdd.toLowerCase())) {
      setErrorMessage("This expertise is already added!");
      return;
    }

    try {
      const response = await axiosInstance.put('/expert/update', {
        expertise: [...profileData.expertise, expertiseToAdd]
      });
      
      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          expertise: [...prev.expertise, expertiseToAdd]
        }));
        setNewExpertise("");
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to add expertise:', error);
      setErrorMessage("Failed to add expertise");
    }
  };

  const handleAddEducation = async () => {
    if (!newEducation.degree || !newEducation.institution || !newEducation.year) {
      setErrorMessage("Please fill all education fields");
      return;
    }

    try {
      const response = await axiosInstance.put('/expert/update', {
        education: [...profileData.education, newEducation]
      });
      
      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          education: [...prev.education, newEducation]
        }));
        setNewEducation({ degree: "", institution: "", year: "" });
        setIsEditingEducation(false);
      }
    } catch (error) {
      console.error('Failed to add education:', error);
      setErrorMessage("Failed to add education");
    }
  };

  const handleAddExperience = async () => {
    if (!newExperience.title || !newExperience.company || !newExperience.duration) {
      setErrorMessage("Please fill all experience fields");
      return;
    }

    try {
      const response = await axiosInstance.put('/expert/update', {
        experience: [...profileData.experience, newExperience]
      });
      
      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          experience: [...prev.experience, newExperience]
        }));
        setNewExperience({ title: "", company: "", duration: "", description: "" });
        setIsEditingExperience(false);
      }
    } catch (error) {
      console.error('Failed to add experience:', error);
      setErrorMessage("Failed to add experience");
    }
  };

  const handleAddCertification = async () => {
    if (!newCertification.name || !newCertification.issuer || !newCertification.year) {
      setErrorMessage("Please fill all certification fields");
      return;
    }

    try {
      const response = await axiosInstance.put('/expert/update', {
        certifications: [...profileData.certifications, newCertification]
      });
      
      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          certifications: [...prev.certifications, newCertification]
        }));
        setNewCertification({ name: "", issuer: "", year: "" });
        setIsEditingCertification(false);
      }
    } catch (error) {
      console.error('Failed to add certification:', error);
      setErrorMessage("Failed to add certification");
    }
  };

  const completionPercentage = (profileData.completedSteps / profileData.totalSteps) * 100;

  return (
    <div className="min-h-screen bg-white pt-24">
      <ErrorPopup message={errorMessage} onClose={() => setErrorMessage("")} />
      <Header className="sticky top-0 z-50 bg-white shadow-md" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Card id="basic-info" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-6">Basic Information</h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button 
                onClick={() => handleEditField('avatar')}
                className="bg-blue-800 text-white hover:bg-[#143d65] px-4 py-2"
              >
                Change Photo
              </Button>
            </div>

            <div className="md:w-3/4">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBox 
                  field="Name" 
                  value={profileData.name} 
                  isEditing={editingField === 'name'}
                  onEdit={() => handleEditField('name')}
                  onSave={(value) => handleSaveField('name', value)}
                />
                <InputBox 
                  field="Title" 
                  value={profileData.title} 
                  isEditing={editingField === 'title'}
                  onEdit={() => handleEditField('title')}
                  onSave={(value) => handleSaveField('title', value)}
                />
                <InputBox 
                  field="Email" 
                  value={profileData.email} 
                  isEditing={editingField === 'email'}
                  onEdit={() => handleEditField('email')}
                  onSave={(value) => handleSaveField('email', value)}
                />
                <InputBox 
                  field="Phone" 
                  value={profileData.phone} 
                  isEditing={editingField === 'phone'}
                  onEdit={() => handleEditField('phone')}
                  onSave={(value) => handleSaveField('phone', value)}
                />
              </form>
            </div>
          </div>
        </Card>

        <Card id="expertise" className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">My Expertise</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {profileData.expertise?.map((exp, index) => (
              <span key={index} className="px-4 py-2 bg-blue-800 text-white rounded-md text-sm">
                {exp}
              </span>
            ))}

            {isEditing ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Enter expertise"
                  className="border-[#d8d8d8] w-48"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddExpertise();
                    }
                  }}
                />
                <Button
                  onClick={handleAddExpertise}
                  className="bg-blue-800 text-white hover:bg-[#143d65] px-4 py-2"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setNewExpertise("");
                    setIsEditing(false);
                  }}
                  className="bg-gray-300 text-black hover:bg-gray-400 px-4 py-2"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-[#d8d8d8] bg-white text-[#232636] hover:bg-[#f5f5f5] rounded-md text-sm flex items-center gap-1"
              >
                <Plus size={16} />
                Add Expertise
              </Button>
            )}
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
                    placeholder="Year"
                    value={newEducation.year}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, year: e.target.value }))}
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
                      setNewEducation({ degree: "", institution: "", year: "" });
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
            {profileData.experience?.map((exp, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
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
                  <Input
                    placeholder="Year"
                    value={newCertification.year}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddCertification}
                    className="bg-blue-800 text-white hover:bg-[#143d65]"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setNewCertification({ name: "", issuer: "", year: "" });
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
            ></div>
          </div>
          <div className="text-sm text-[#676767] mt-1">
            Profile completion: {profileData.completedSteps}/{profileData.totalSteps} steps completed
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ExpertProfile;