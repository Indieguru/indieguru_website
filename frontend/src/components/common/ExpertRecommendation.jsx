import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import IndustryDropdown from './IndustryDropdown';

const ExpertRecommendation = ({ formData, onExpertSelect }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const submitAssessment = useCallback(async () => {
    if (!formData) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        '/api/assessment/submit',
        {
          ...formData,
          industry: selectedIndustry
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setExperts(response.data.experts);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching expert recommendations');
      console.error('Error submitting assessment:', err);
    } finally {
      setLoading(false);
    }
  }, [formData, selectedIndustry, token]);

  useEffect(() => {
    const industryRequiredGuidance = [
      'To know about a particular profession',
      'One-on-one expert mentorship to advance my career path',
      'How to pivot to a different career/Industry'
    ];
    const needsIndustry = industryRequiredGuidance.includes(formData?.guidanceFor);
    setShowIndustryDropdown(needsIndustry);
    
    if (!needsIndustry) {
      submitAssessment();
    }
  }, [formData?.guidanceFor, submitAssessment]);

  useEffect(() => {
    if (showIndustryDropdown && selectedIndustry) {
      submitAssessment();
    }
  }, [selectedIndustry, showIndustryDropdown, submitAssessment]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600">
        <p>{error}</p>
        <button 
          onClick={submitAssessment}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showIndustryDropdown && (
        <IndustryDropdown
          onSelect={setSelectedIndustry}
          selectedIndustry={selectedIndustry}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <div
              key={expert._id}
              onClick={() => onExpertSelect(expert)}
              className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={expert.avatar || '/placeholder-user.jpg'}
                  alt={expert.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
                  <p className="text-sm text-gray-600">{expert.domain}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">{expert.ratings?.toFixed(1) || '4.5'}</span>
                    <span className="text-sm text-gray-400">({expert.sessionCount || '0'} sessions)</span>
                  </div>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-600 line-clamp-3">{expert.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {expert.expertise.slice(0, 3).map((expertise, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs"
                  >
                    {expertise.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>

              <button
                className="mt-4 w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Book Session
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && experts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No experts found matching your criteria. Please try different filters.</p>
        </div>
      )}
    </div>
  );
};

export default ExpertRecommendation;