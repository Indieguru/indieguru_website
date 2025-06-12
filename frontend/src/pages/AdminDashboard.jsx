import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios.config';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import RefundRequestsSection from '../components/admin/RefundRequestsSection';

const RejectionModal = ({ isOpen, onClose, onReject, type }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }
    onReject(reason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reject {type}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Rejection
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
              placeholder="Please provide a reason for rejection..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [pendingExperts, setPendingExperts] = useState([]);
  const [expertsWithOutstanding, setExpertsWithOutstanding] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingCohorts, setPendingCohorts] = useState([]);
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [cancelledSessions, setCancelledSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showPlatformPriceModal, setShowPlatformPriceModal] = useState(false);
  const [sessionPrice, setSessionPrice] = useState('');
  const [platformFee, setPlatformFee] = useState('');
  const [platformPrice, setPlatformPrice] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'expert', 'course', or 'cohort'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpertDetails, setSelectedExpertDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingExperts();
    fetchExpertsWithOutstanding();
    fetchPendingContent();
    fetchPendingBlogs();
    fetchCancelledSessions();
  }, []);

  const fetchPendingExperts = async () => {
    try {
      const response = await axiosInstance.get('/admin/pending-experts');
      setPendingExperts(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending experts');
      if (error.response?.status === 403) {
        navigate('/expert');
      }
    }
  };

  const fetchExpertsWithOutstanding = async () => {
    try {
      const response = await axiosInstance.get('/admin/experts-outstanding');
      setExpertsWithOutstanding(response.data);
    } catch (error) {
      toast.error('Failed to fetch experts with outstanding amounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingContent = async () => {
    try {
      const response = await axiosInstance.get('/admin/pending-content');
      setPendingCourses(response.data.courses);
      setPendingCohorts(response.data.cohorts);
    } catch (error) {
      toast.error('Failed to fetch pending content');
    }
  };

  const fetchPendingBlogs = async () => {
    try {
      const response = await axiosInstance.get('/blog/admin/pending');
      setPendingBlogs(response.data.blogs);
    } catch (error) {
      toast.error('Failed to fetch pending blogs');
    }
  };

  const fetchCancelledSessions = async () => {
    try {
      const response = await axiosInstance.get('/admin/cancelled-sessions');
      setCancelledSessions(response.data);
    } catch (error) {
      toast.error('Failed to fetch cancelled sessions');
      console.error('Error fetching cancelled sessions:', error);
    }
  };

  const handleApprove = async () => {
    try {
      await axiosInstance.post(`/admin/experts/${selectedExpert._id}/approve`, {
        sessionPrice: Number(sessionPrice),
        platformFee: Number(platformFee)
      });
      toast.success('Expert approved successfully');
      setShowApprovalModal(false);
      fetchPendingExperts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve expert');
    }
  };

  const handleReject = async () => {
    try {
      await axiosInstance.post(`/admin/experts/${selectedExpert._id}/reject`, {
        reason: rejectionReason
      });
      toast.success('Expert rejected successfully');
      setShowRejectionModal(false);
      fetchPendingExperts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject expert');
    }
  };

  const handleClearOutstanding = async (expertId) => {
    try {
      await axiosInstance.post(`/admin/experts/${expertId}/clear-outstanding`);
      toast.success('Outstanding amount cleared successfully');
      fetchExpertsWithOutstanding();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear outstanding amount');
    }
  };

  const handleContentApprove = async (type, id) => {
    try {
      if (!platformPrice) {
        toast.error('Please enter platform price');
        return;
      }

      const response = await axiosInstance.post(`/admin/${type}s/${id}/approve`, {
        platformPrice: Number(platformPrice)
      });

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} approved successfully`);
      setShowPlatformPriceModal(false);
      setPlatformPrice('');
      fetchPendingContent();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to approve ${type}`);
    }
  };

  const handleContentReject = async (type, id, rejectionReason) => {
    try {
      if (!rejectionReason) {
        toast.error('Please enter rejection reason');
        return;
      }

      await axiosInstance.post(`/admin/${type}s/${id}/reject`, {
        reason: rejectionReason
      });

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} rejected successfully`);
      setShowRejectionModal(false);
      setRejectionReason('');
      fetchPendingContent();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to reject ${type}`);
    }
  };

  const handleBlogApprove = async (blogId) => {
    try {
      await axiosInstance.post(`/blog/admin/${blogId}/approve`);
      toast.success('Blog approved successfully');
      fetchPendingBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve blog');
    }
  };

  const handleBlogReject = async (blogId, reason) => {
    try {
      await axiosInstance.post(`/blog/admin/${blogId}/reject`, { reason });
      toast.success('Blog rejected successfully');
      fetchPendingBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject blog');
    }
  };

  const handleMarkRefundProcessed = async (sessionId) => {
    try {
      await axiosInstance.post(`/admin/sessions/${sessionId}/refund-processed`);
      toast.success('Session marked as refunded successfully');
      // Remove the session from the list
      setCancelledSessions(prevSessions => prevSessions.filter(session => session._id !== sessionId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark refund as processed');
    }
  };

  const handleItemClick = async (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);

    if (type === 'expert') {
      try {
        setIsLoadingDetails(true);
        const response = await axiosInstance.get(`/experts/${item._id}`);
        setSelectedExpertDetails(response.data);
      } catch (error) {
        toast.error('Failed to fetch expert details');
        console.error('Error fetching expert details:', error);
      } finally {
        setIsLoadingDetails(false);
      }
    }
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalType(null);
  };

  const ExpertDetails = ({ expert }) => {
    if (isLoadingDetails) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    const details = selectedExpertDetails || expert;

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {details.name?.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{details.name}</h3>
            <p className="text-gray-600">{details.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
            <div className="space-y-2 text-gray-600">
              <p>Email: {details.email}</p>
              <p>Phone: {details.phoneNo || 'Not provided'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Status</h4>
            <div className="space-y-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${details.status === 'approved' ? 'bg-green-100 text-green-800' :
                  details.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                {details.status?.charAt(0).toUpperCase() + details.status?.slice(1)}
              </span>
              {details.rejectionReason && (
                <p className="text-sm text-red-600">
                  Rejection reason: {details.rejectionReason}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <h4 className="font-medium text-gray-900 mb-2">Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {details.expertise?.map((exp, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>

          {details.education && details.education.length > 0 && (
            <div className="col-span-2">
              <h4 className="font-medium text-gray-900 mb-2">Education</h4>
              <div className="space-y-3">
                {details.education.map((edu, idx) => (
                  <div key={idx} className="rounded-lg bg-gray-50 p-3">
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">
                      {edu.startYear} - {edu.endYear || 'Present'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.experience && details.experience.length > 0 && (
            <div className="col-span-2">
              <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
              <div className="space-y-3">
                {details.experience.map((exp, idx) => (
                  <div key={idx} className="rounded-lg bg-gray-50 p-3">
                    <p className="font-medium">{exp.title}</p>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.certifications && details.certifications.length > 0 && (
            <div className="col-span-2">
              <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
              <div className="space-y-3">
                {details.certifications.map((cert, idx) => (
                  <div key={idx} className="rounded-lg bg-gray-50 p-3">
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-gray-600">{cert.issuingOrganization}</p>
                    <p className="text-sm text-gray-500">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                    {cert.documentUrl && (
                      <a
                        href={cert.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.outstandingAmount && (
            <div className="col-span-2">
              <h4 className="font-medium text-gray-900 mb-2">Outstanding Amount</h4>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Sessions</p>
                    <p className="font-medium">₹{details.outstandingAmount.sessions || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Courses</p>
                    <p className="font-medium">₹{details.outstandingAmount.courses || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cohorts</p>
                    <p className="font-medium">₹{details.outstandingAmount.cohorts || 0}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Total Outstanding</p>
                  <p className="font-medium text-lg">₹{details.outstandingAmount.total || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CourseDetails = ({ course }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{course.title}</h3>
      <p className="text-gray-600">{course.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Expert</p>
          <p className="text-gray-600">{course.expertName}</p>
        </div>
        <div>
          <p className="font-medium">Pricing</p>
          <p className="text-gray-600">₹{course.pricing?.total || 0}</p>
        </div>
        <div>
          <p className="font-medium">Status</p>
          <p className="text-gray-600">{course.status}</p>
        </div>
        <div>
          <p className="font-medium">Drive Link</p>
          <a href={course.driveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View Content
          </a>
        </div>
      </div>
    </div>
  );

  const CohortDetails = ({ cohort }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{cohort.title}</h3>
      <p className="text-gray-600">{cohort.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Expert</p>
          <p className="text-gray-600">{cohort.expertName}</p>
        </div>
        <div>
          <p className="font-medium">Duration</p>
          <p className="text-gray-600">
            {new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="font-medium">Pricing</p>
          <p className="text-gray-600">₹{cohort.pricing?.total || 0}</p>
        </div>
        <div>
          <p className="font-medium">Meet Link</p>
          <a href={cohort.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Join Meeting
          </a>
        </div>
        <div>
          <p className="font-medium">Status</p>
          <p className="text-gray-600">{cohort.status}</p>
        </div>
        <div>
          <p className="font-medium">Participants</p>
          <p className="text-gray-600">{cohort.purchasedBy?.length || 0} enrolled</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Cancelled Sessions Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Cancelled Sessions Pending Refund</h2>
          
          {cancelledSessions.length === 0 ? (
            <p className="text-gray-600">No cancelled sessions pending refund</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expert Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cancelledSessions.map((session) => (
                    <tr key={session._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.startTime} - {session.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.expertDetails?.email || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.expertDetails?.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.studentDetails?.email || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.studentDetails?.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">Expert: ₹{session.pricing?.expertPrice || 0}</div>
                        <div className="text-sm text-gray-600">Platform: ₹{session.pricing?.platformPrice || 0}</div>
                        <div className="text-sm font-medium text-gray-900">Total: ₹{session.pricing?.totalPrice || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleMarkRefundProcessed(session._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Refund Done
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Outstanding Amounts Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Outstanding Payments</h2>
          
          {expertsWithOutstanding.length === 0 ? (
            <p className="text-gray-600">No outstanding payments to show</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cohorts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expertsWithOutstanding.map((expert) => (
                    <tr key={expert._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {expert.firstName} {expert.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{expert.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{expert.outstandingAmount.sessions}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{expert.outstandingAmount.courses}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{expert.outstandingAmount.cohorts}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{expert.outstandingAmount.total}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleClearOutstanding(expert._id)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                        >
                          Clear Outstanding
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Experts Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Expert Approvals</h2>
          
          {pendingExperts.length === 0 ? (
            <p className="text-gray-600">No pending expert approvals</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingExperts.map((expert) => (
                    <tr key={expert._id} onClick={() => handleItemClick(expert, 'expert')} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {expert.firstName} {expert.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{expert.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{expert.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {expert.expertise.join(", ")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedExpert(expert);
                            setShowApprovalModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedExpert(expert);
                            setShowRejectionModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Courses Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Courses</h2>
          
          {pendingCourses.length === 0 ? (
            <p className="text-gray-600">No pending courses to approve</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expert</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingCourses.map((course) => (
                    <tr key={course._id} onClick={() => handleItemClick(course, 'course')} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {course.expertName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">{course.expert?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{course.pricing?.expertFee || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedContent({ type: 'course', item: course });
                            setShowPlatformPriceModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContent({ type: 'course', item: course });
                            setShowRejectionModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Cohorts Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Cohorts</h2>
          
          {pendingCohorts.length === 0 ? (
            <p className="text-gray-600">No pending cohorts to approve</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expert</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingCohorts.map((cohort) => (
                    <tr key={cohort._id} onClick={() => handleItemClick(cohort, 'cohort')} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cohort.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {cohort.expertName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">{cohort.expert?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{cohort.pricing?.expertFee || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(cohort.startDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedContent({ type: 'cohort', item: cohort });
                            setShowPlatformPriceModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContent({ type: 'cohort', item: cohort });
                            setShowRejectionModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Blogs Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Blogs</h2>
          
          {pendingBlogs.length === 0 ? (
            <p className="text-gray-600">No pending blogs to approve</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingBlogs.map((blog) => (
                    <tr 
                      key={blog._id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleBlogClick(blog._id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{blog.authorName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{blog.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleBlogApprove(blog._id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContent({ type: 'blog', item: blog });
                            setShowRejectionModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Refund Requests Section */}
        <RefundRequestsSection />
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Set Session Pricing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expert Fee (₹)
                </label>
                <input
                  type="number"
                  value={sessionPrice}
                  onChange={(e) => setSessionPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter session price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Fee (₹)
                </label>
                <input
                  type="number"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter platform fee"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Approve Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      <RejectionModal 
        isOpen={showRejectionModal}
        onClose={() => {
          setShowRejectionModal(false);
          setSelectedContent(null);
        }}
        onReject={(reason) => {
          if (selectedContent?.type === 'blog') {
            handleBlogReject(selectedContent.item._id, reason);
          } else {
            handleContentReject(selectedContent.type, selectedContent.item._id, reason);
          }
        }}
        type={selectedContent?.type === 'blog' ? 'Blog' : 
              selectedContent?.type === 'course' ? 'Course' : 'Cohort'}
      />

      {/* Platform Price Modal */}
      {showPlatformPriceModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              Set Platform Price for {selectedContent.type === 'course' ? 'Course' : 'Cohort'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Price (₹)
                </label>
                <input
                  type="number"
                  value={platformPrice}
                  onChange={(e) => setPlatformPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter platform price"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowPlatformPriceModal(false);
                    setPlatformPrice('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleContentApprove(selectedContent.type, selectedContent.item._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-xl font-semibold">
                      {modalType === 'expert' ? 'Expert Details' :
                       modalType === 'course' ? 'Course Details' :
                       'Cohort Details'}
                    </Dialog.Title>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {modalType === 'expert' && <ExpertDetails expert={selectedItem} />}
                  {modalType === 'course' && <CourseDetails course={selectedItem} />}
                  {modalType === 'cohort' && <CohortDetails cohort={selectedItem} />}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}