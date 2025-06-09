import React, { useState } from 'react';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import axiosInstance from '../../config/axios.config';
import { BookOpen, FileText, Link, DollarSign, Eye, X } from 'lucide-react';

export default function AddCourseModal({ isOpen, onClose }) {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    courseOverview: '',
    driveLink: '',
    expertFee: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setCourseData({
      title: '',
      description: '',
      courseOverview: '',
      driveLink: '',
      expertFee: ''
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
      await axiosInstance.post('/expert/courses', courseData);
      resetForm();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
          {/* Header */}
          <div className="bg-[#003265] px-8 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Create New Course</h2>
              </div>
              <button
                onClick={handleClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-white/80 mt-2">Share your expertise with students worldwide</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Title */}
              <div className="group">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <BookOpen className="w-4 h-4 text-[#003265]" />
                  <span>Course Title</span>
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="title"
                    value={courseData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Master React Development in 30 Days"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#003265] focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Course Overview */}
              <div className="group">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>Course Overview</span>
                </label>
                <Textarea
                  name="courseOverview"
                  value={courseData.courseOverview}
                  onChange={handleInputChange}
                  required
                  placeholder="A brief, engaging overview that captures what students will learn..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-0 transition-colors bg-gray-50 focus:bg-white resize-none"
                />
              </div>

              {/* Description */}
              <div className="group">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Detailed Description</span>
                </label>
                <Textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Provide a comprehensive description including curriculum, learning outcomes, prerequisites..."
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0 transition-colors bg-gray-50 focus:bg-white resize-none"
                />
              </div>

              {/* Drive Link */}
              <div className="group">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <Link className="w-4 h-4 text-blue-500" />
                  <span>Course Materials Link</span>
                </label>
                <div className="relative">
                  <Input
                    type="url"
                    name="driveLink"
                    value={courseData.driveLink}
                    onChange={handleInputChange}
                    required
                    placeholder="https://drive.google.com/..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                  <span>💡</span>
                  <span>Make sure the link is publicly accessible to students</span>
                </p>
              </div>

              {/* Expert Fee */}
              <div className="group">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>Your Expert Fee (INR)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-gray-500 text-lg">₹</span>
                  </div>
                  <Input
                    type="number"
                    name="expertFee"
                    value={courseData.expertFee}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="5000"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                  <p className="text-sm text-green-700 flex items-center space-x-2">
                    <span>💰</span>
                    <span>This is your earning per enrollment. Platform fees are handled separately.</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#003265] text-white hover:bg-[#004080] rounded-xl font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>Create Course</span>
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