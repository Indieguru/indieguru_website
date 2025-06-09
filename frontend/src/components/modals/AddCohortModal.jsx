import React, { useState } from 'react';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import axiosInstance from '../../config/axios.config';
import { Users, FileText, Video, DollarSign, Calendar, X } from 'lucide-react';

export default function AddCohortModal({ isOpen, onClose }) {
  const [cohortData, setCohortData] = useState({
    title: '',
    description: '',
    meetLink: '',
    expertFee: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCohortData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setCohortData({
      title: '',
      description: '',
      meetLink: '',
      expertFee: '',
      startDate: '',
      endDate: ''
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/expert/cohorts', cohortData);
      resetForm();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create cohort');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hidden">
          {/* Header */}
          <div className="bg-[#003265] px-8 py-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create New Cohort</h2>
                  <p className="text-white/80 text-sm">Build a learning community with your expertise</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cohort Title */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <Users className="w-4 h-4 text-[#003265]" />
                  <span>Cohort Title</span>
                </label>
                <Input
                  type="text"
                  name="title"
                  value={cohortData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Full Stack Development Bootcamp"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#003265] focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Description</span>
                </label>
                <Textarea
                  name="description"
                  value={cohortData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe what students will learn, the format, and expectations..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-0 transition-colors bg-gray-50 focus:bg-white resize-none"
                />
              </div>

              {/* Meet Link */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Meeting Link</span>
                </label>
                <Input
                  type="url"
                  name="meetLink"
                  value={cohortData.meetLink}
                  onChange={handleInputChange}
                  required
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                  <span>💡</span>
                  <span>Ensure the meeting link is accessible to all participants</span>
                </p>
              </div>

              {/* Expert Fee */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>Expert Fee (INR)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-gray-500 text-lg">₹</span>
                  </div>
                  <Input
                    type="number"
                    name="expertFee"
                    value={cohortData.expertFee}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="5000"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">💰 Pricing Structure</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span><strong>Expert Fee:</strong> Your earning per enrollment</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span><strong>Platform Fee:</strong> Added automatically by IndieGuru</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span><strong>Total Price:</strong> Sum of expert fee and platform fee</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Cohort Duration</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Start Date</label>
                    <Input
                      type="date"
                      name="startDate"
                      value={cohortData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">End Date</label>
                    <Input
                      type="date"
                      name="endDate"
                      value={cohortData.endDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#003265] text-white hover:bg-[#004080] rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Create Cohort</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}