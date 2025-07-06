import React from 'react';

const IndustryDropdown = ({ onSelect, selectedIndustry }) => {
  const industries = [
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

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900">Select Industry</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {industries.map((industry) => (
          <button
            key={industry}
            onClick={() => onSelect(industry)}
            className={`p-4 rounded-lg text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
              selectedIndustry === industry
                ? 'bg-blue-800 text-white'
                : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
            } border border-gray-200`}
          >
            {industry}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IndustryDropdown;