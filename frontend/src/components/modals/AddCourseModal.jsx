import React, { useState } from 'react';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import axiosInstance from '../../config/axios.config';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/expert/courses', courseData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add New Course">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <Input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter course title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Overview
          </label>
          <Textarea
            name="courseOverview"
            value={courseData.courseOverview}
            onChange={handleInputChange}
            required
            placeholder="Enter a brief overview of the course"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            required
            placeholder="Enter course description"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Drive Link
          </label>
          <Input
            type="url"
            name="driveLink"
            value={courseData.driveLink}
            onChange={handleInputChange}
            required
            placeholder="Enter Google Drive link"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expert Fee (INR)
          </label>
          <Input
            type="number"
            name="expertFee"
            value={courseData.expertFee}
            onChange={handleInputChange}
            required
            min="0"
            placeholder="Enter your expert fee"
          />
          <p className="text-xs text-gray-500 mt-1">
            Platform fee will be added automatically. Your fee is what you'll earn per enrollment.
          </p>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}