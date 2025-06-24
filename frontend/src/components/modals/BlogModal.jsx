import React from 'react';
import CreateBlog from '../blog/CreateBlog';
import { X, AlertCircle } from 'lucide-react';
import useExpertStore from '../../store/expertStore';

const BlogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { expertData } = useExpertStore();
  const isExpertApproved = expertData && expertData.status === 'approved';

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hidden">
          {/* Header */}
          <div className="bg-[#003265] px-8 py-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create Blog Post</h2>
                  <p className="text-white/80 text-sm">Share your knowledge and insights with the community</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-0">
            {isExpertApproved ? (
              <CreateBlog onClose={onClose} />
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Approval Required</h3>
                <p className="text-gray-600 mb-6">
                  Your expert profile needs to be approved before you can create blog posts. 
                  This helps ensure high-quality content for our users.
                </p>
                <p className="text-gray-600 mb-6">
                  Please complete your profile and request approval from the Expert Profile page.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-[#003265] text-white rounded-lg hover:bg-[#002450] transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;