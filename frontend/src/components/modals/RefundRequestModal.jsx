import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

const RefundRequestModal = ({ isOpen, onClose, session, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Validate file types (only images)
    const validFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    if (validFiles.length !== selectedFiles.length) {
      setError('Only image files are allowed');
      return;
    }
    
    // Validate file size (max 5MB each)
    const invalidSizeFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidSizeFiles.length > 0) {
      setError('Files must be less than 5MB each');
      return;
    }
    
    setFiles([...files, ...validFiles]);
    setError('');
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for the refund request');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('reason', reason);
      
      files.forEach(file => {
        formData.append('files', file);
      });

      await onSubmit(session._id, formData);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit refund request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Request Refund</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Please provide a reason for your refund request. Attaching supporting images may help in the approval process.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Refund
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                placeholder="Please explain why you're requesting a refund..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Documents (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  multiple
                  accept="image/*"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </label>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Files ({files.length})
                </h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span className="text-sm text-gray-600 truncate flex-1">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Request Refund'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RefundRequestModal;