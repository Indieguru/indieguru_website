import React, { useState } from 'react';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import axiosInstance from '../../config/axios.config';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/expert/cohorts', cohortData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create cohort');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add New Cohort">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cohort Title
          </label>
          <Input
            type="text"
            name="title"
            value={cohortData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter cohort title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            name="description"
            value={cohortData.description}
            onChange={handleInputChange}
            required
            placeholder="Enter cohort description"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meet Link
          </label>
          <Input
            type="url"
            name="meetLink"
            value={cohortData.meetLink}
            onChange={handleInputChange}
            required
            placeholder="Enter Google Meet link"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expert Fee (INR)
          </label>
          <Input
            type="number"
            name="expertFee"
            value={cohortData.expertFee}
            onChange={handleInputChange}
            required
            min="0"
            placeholder="Enter your expert fee"
          />
          <div className="mt-2 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700 font-medium mb-1">Pricing Structure:</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Expert Fee: What you'll earn per enrollment</li>
              <li>• Platform Fee: Added automatically by IndieGuru</li>
              <li>• Total Price: Sum of expert fee and platform fee</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <Input
              type="date"
              name="startDate"
              value={cohortData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <Input
              type="date"
              name="endDate"
              value={cohortData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
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
            {loading ? 'Creating...' : 'Create Cohort'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}