import { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';
import axiosInstance from '../../config/axios.config';
import { toast } from 'react-toastify';

export default function FeedbackModal({ isOpen, onClose, session }) {
  const [feedbackData, setFeedbackData] = useState({
    heading: '',
    description: ''
  });
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);

  useEffect(() => {
    if (session?.feedback) {
      setExistingFeedback({
        rating: session.feedback.rating || 0,
        detail: session.feedback.detail || { heading: '', description: '' }
      });
    }
  }, [session]);

  const handleSubmit = async () => {
    if (!feedbackData.heading || !feedbackData.description || rating === 0) {
      toast.error('Please provide heading, description and rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(`/session/${session._id}/feedback`, {
        rating,
        heading: feedbackData.heading,
        description: feedbackData.description
      });

      if (response.data) {
        toast.success('Feedback submitted successfully!');
        // Reload the page to refresh sessions
        window.location.reload();
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Session Feedback">
      <div className="p-6">
        {existingFeedback ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Feedback</h3>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= existingFeedback.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">{existingFeedback.detail.heading}</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {existingFeedback.detail.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate your experience
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      } cursor-pointer hover:scale-110 transition-transform`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Heading
              </label>
              <input
                type="text"
                value={feedbackData.heading}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, heading: e.target.value }))}
                placeholder="Give a brief title to your feedback..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Feedback
              </label>
              <textarea
                value={feedbackData.description}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Share your detailed experience about this session..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !feedbackData.heading || !feedbackData.description || rating === 0}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}