import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios.config';
import useUserStore from '../../store/userStore';
import useUserTypeStore from '../../store/userTypeStore';

const ExpertRecommendation = ({ formData, selectedIndustry, onClose }) => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUserStore();
  const { userType } = useUserTypeStore();
  const navigate = useNavigate();

  const submitAssessment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Store full questions and answers with context
      const assessmentQuestions = {
        role: {
          question: "Tell us a bit about yourself",
          answer: formData.role,
          context: "User background and current status"
        },
        degree: formData.degree ? {
          question: "What's your degree?",
          answer: formData.degree,
          context: "Educational background"
        } : null,
        stream: formData.stream ? {
          question: "What's your stream?",
          answer: formData.stream,
          context: "High school specialization"
        } : null,
        confusion: {
          question: "How confused do you feel about your next steps?",
          answer: formData.confusion,
          scale: "1-10 (1 = Not confused at all, 10 = Completely confused)",
          context: "Career confusion assessment"
        },
        careerJourney: {
          question: "What defines you best when it comes to your career journey?",
          answer: formData.careerJourney,
          context: "Current career state assessment"
        },
        learningStyle: {
          question: "My learning style is correctly described as",
          answer: formData.learningStyle,
          otherStyle: formData.otherLearningStyle,
          context: "Preferred learning method"
        },
        expertise: {
          question: "What are you seeking guidance for?",
          answer: formData.expertisePreference,
          context: "Specific expertise needed"
        }
      };

      // Include personal details
      const personalInfo = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        city: formData.cityOfResidence,
        linkedinUrl: formData.linkedinUrl || '',
        industry: selectedIndustry
      };

      // Send complete assessment data
      const response = await axiosInstance.post('/assessment/submit', {
        assessmentQuestions,
        personalInfo,
        rawFormData: formData // Include original form data for backward compatibility
      });

      if (response.data.success) {
        setExperts(response.data.experts);
      } else {
        setError('Failed to get expert recommendations');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit assessment");
      console.error('Error submitting assessment:', err);
    } finally {
      setLoading(false);
    }
  }, [formData, selectedIndustry]);

  useEffect(() => {
    if (userType === 'student' && user) {
      submitAssessment();
    }
  }, [userType, user, submitAssessment]);

  const handleExpertSelect = (expert) => {
    navigate(`/booking/${expert._id}`, {
      state: {
        expert,
        assessmentData: formData
      }
    });
    onClose();
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={submitAssessment}
          className="mt-4 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Finding the best experts for you...</p>
      </div>
    );
  }

  if (!experts.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No matching experts found. Please try adjusting your preferences.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900">Recommended Experts</h3>
      <div className="space-y-4">
        {experts.map((expert) => (
          <div
            key={expert._id}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-400 transition-colors"
          >
            <div className="flex items-start gap-4">
              <img
                src={expert.profilePicture || '/placeholder-user.jpg'}
                alt={`${expert.firstName} ${expert.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {expert.firstName} {expert.lastName}
                    </h4>
                    <p className="text-gray-600">{expert.title}</p>
                  </div>
                  <button
                    onClick={() => handleExpertSelect(expert)}
                    className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Book Session
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {expert.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                    >
                      {exp.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-gray-700">{expert.rating?.toFixed(1) || "N/A"}</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">{expert.totalFeedbacks || 0} reviews</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-900 font-semibold">₹{expert.sessionPricing?.total || 0}/session</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertRecommendation;