import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios.config';
import { toast } from 'react-hot-toast';
import { Type, Tag, FileText, Image, X } from 'lucide-react';

const CreateBlog = ({ onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    images: []
  });
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'startup', name: 'Startup' },
    { id: 'business', name: 'Business' },
    { id: 'technology', name: 'Technology' },
    { id: 'economy', name: 'Economy' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }
    
    // Create preview URLs for new images
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    // Remove image from formData
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Remove preview URL and revoke object URL
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('content', formData.content);
      formPayload.append('category', formData.category);

      formData.images.forEach(image => {
        formPayload.append('images', image);
      });

      await axiosInstance.post('/blog/expert/create', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Blog created successfully');
      onClose();
      navigate('/blog');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-8 p-8">
        {/* Title Field */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
            <Type className="w-4 h-4 text-[#003265]" />
            <span>Blog Title</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter an engaging title for your blog post..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#003265] focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
            required
          />
        </div>

        {/* Category Field */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
            <Tag className="w-4 h-4 text-blue-600" />
            <span>Category</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content Field */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Content</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="8"
            placeholder="Write your blog content here. Share your knowledge, insights, and experiences..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-0 transition-colors bg-gray-50 focus:bg-white resize-none"
            required
          />
        </div>

        {/* Images Field */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
            <Image className="w-4 h-4 text-green-600" />
            <span>Images (Optional - Max 3)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:border-green-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#003265] file:text-white hover:file:bg-[#004080] file:cursor-pointer cursor-pointer"
              max="3"
            />
            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
              <Image className="w-3 h-3" />
              <span>Upload up to 3 images to enhance your blog post</span>
            </div>
          </div>

          {/* Image Previews */}
          {imagePreviewUrls.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Image Previews</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Click × to remove</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
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
                <FileText className="w-4 h-4" />
                <span>Create Blog</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;