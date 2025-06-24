import React, { useState } from 'react';
import { X, Phone, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios.config';

const PhoneUpdateModal = ({ isOpen, onClose, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    // Phone number validation (simple pattern)
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axiosInstance.put('/user/update', { phone });
      
      if (response.status === 200) {
        toast.success('Phone number updated successfully!');
        onSuccess(phone);
      }
    } catch (err) {
      console.error('Failed to update phone number:', err);
      
      // Check specifically for duplicate key error
      if (err.response?.data?.code === 11000 || 
          err.response?.status === 409 || 
          err.response?.data?.message?.includes('duplicate') ||
          err.response?.data?.message?.includes('already in use')) {
        setError('This phone number is already associated with another account. Please use a different number.');
      } else {
        setError(err.response?.data?.message || 'Failed to update phone number. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-[#003265] px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Contact Information Required</h2>
              </div>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <p className="text-gray-600 mb-4">
              Please provide your phone number to complete your booking. This information is used for communication regarding your sessions and important updates.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#003265] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update & Continue'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneUpdateModal;