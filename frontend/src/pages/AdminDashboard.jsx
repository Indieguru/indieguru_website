import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios.config';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import {  Search, X } from 'lucide-react';
import RefundRequestsSection from '../components/admin/RefundRequestsSection';
import useExpertStore from '../store/expertStore';
import useUserTypeStore from '../store/userTypeStore';
import checkAuth from '../utils/checkAuth';
import LoadingScreen from '../components/common/LoadingScreen';

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
  // Add expertStore and auth-related state
  const { expertData, fetchExpertData, isLoading: expertLoading } = useExpertStore();
  const { userType, setUserType } = useUserTypeStore();
  const [authLoading, setAuthLoading] = useState(true);
  const [authData, setAuthData] = useState(null);

  const [activeTab, setActiveTab] = useState('pending-experts');
  const [pendingExperts, setPendingExperts] = useState([]);
  const [expertsList, setExpertsList] = useState([]);
  const [searchExpertInput, setsearchExpertInput] = useState(""); 
  const [searchExpertQuery, setsearchExpertQuery] = useState("");
  const [selectedExpertDetail, setSelectedExpertDetail] = useState(null);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [expertsWithOutstanding, setExpertsWithOutstanding] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingCohorts, setPendingCohorts] = useState([]);
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [cancelledSessions, setCancelledSessions] = useState([]);
  const [earningsData, setEarningsData] = useState(null);
  const [sessionsData, setSessionsData] = useState(null);
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

  // Earnings filter states
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Sessions filter states
  const [sessionStartDate, setSessionStartDate] = useState('');
  const [sessionEndDate, setSessionEndDate] = useState('');
  const [isSearchingSessions, setIsSearchingSessions] = useState(false);

  const navigate = useNavigate();

  // Add authentication and admin check logic
  useEffect(() => {
    const handleAuth = async () => {
      const data = await checkAuth(setUserType, setAuthLoading);
      setAuthData(data);
    };
    handleAuth();
  }, [setUserType]);

  useEffect(() => {
    if (authData) {
      if (userType === "student") {
        navigate("/dashboard");
        return;
      } else if (userType === "not_signed_in") {
        navigate("/signup");
        return;
      } else if (userType === "expert") {
        // Fetch expert data to check admin status
        fetchExpertData();
      }
    }
  }, [userType, navigate, fetchExpertData, authData]);

  // Add effect to check admin status after expert data is loaded
  useEffect(() => {
    // Only redirect if expert data has been loaded (not loading) and isAdmin is false
    if (!expertLoading && expertData && expertData.hasOwnProperty('isAdmin') && !expertData.isAdmin) {
      navigate('/expert/dashboard');
    }
  }, [expertLoading, expertData, navigate]);

  useEffect(() => {
    // Only fetch admin data if user is confirmed to be an admin
    if (!expertLoading && expertData && expertData.isAdmin) {
      fetchPendingExperts();
      fetchExpertsWithOutstanding();
      fetchPendingContent();
      fetchPendingBlogs();
      fetchAllExperts();
      fetchCancelledSessions();
    }
  }, [expertLoading, expertData]);
  
  const filteredExperts = expertsList.filter((expert) => {
    const fullName = `${expert.firstName} ${expert.lastName}`.toLowerCase();
    const email = expert.email.toLowerCase();
    const query = searchExpertQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

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

  const fetchAllExperts = async () => {
    try {
      // backend exposes a search route that returns approved experts when no query provided
      const response = await axiosInstance.get('/admin/all-experts')
      setExpertsList(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch experts list');
      console.error('Error fetching experts list:', error);
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

  const fetchEarnings = async (type = 'all', start = '', end = '') => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (type && type !== 'all') params.append('type', type);
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);

      const response = await axiosInstance.get(`/admin/earnings?${params.toString()}`);
      setEarningsData(response.data);
    } catch (error) {
      console.error('Error fetching admin earnings:', error);
      toast.error('Failed to fetch earnings data');
    } finally {
      setIsSearching(false);
    }
  };

  const fetchSessions = async (start = '', end = '') => {
    setIsSearchingSessions(true);
    try {
      const params = new URLSearchParams();
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);

      const response = await axiosInstance.get(`/admin/sessions?${params.toString()}`);
      setSessionsData(response.data);
    } catch (error) {
      console.error('Error fetching admin sessions:', error);
      toast.error('Failed to fetch sessions data');
    } finally {
      setIsSearchingSessions(false);
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

  const handleEarningsSearch = () => {
    fetchEarnings(filterType, startDate, endDate);
  };

  const resetEarningsFilters = () => {
    setFilterType('all');
    setStartDate('');
    setEndDate('');
    setEarningsData(null);
  };

  const handleSessionsSearch = () => {
    fetchSessions(sessionStartDate, sessionEndDate);
  };

  const resetSessionsFilters = () => {
    setSessionStartDate('');
    setSessionEndDate('');
    setSessionsData(null);
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

  const renderPendingExperts = () => (
    <div className="bg-white rounded-lg shadow p-6">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExpert(expert);
                        setShowApprovalModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Approve
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
  );

  const renderOutstanding = () => (
    <div className="bg-white rounded-lg shadow p-6">
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
  );

  const renderPendingContent = () => (
    <div className="space-y-8">
      {/* Pending Courses Section */}
      <div className="bg-white rounded-lg shadow p-6">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContent({ type: 'course', item: course });
                          setShowPlatformPriceModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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
      <div className="bg-white rounded-lg shadow p-6">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContent({ type: 'cohort', item: cohort });
                          setShowPlatformPriceModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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
    </div>
  );

  const renderPendingBlogs = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Blog Approvals</h2>
      
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingBlogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {blog.content.substring(0, 100)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{blog.authorName || blog.expertName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleBlogClick(blog._id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleBlogApprove(blog._id)}
                      className="text-green-600 hover:text-green-900 mr-4"
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
  );

  const renderSessionsTab = () => (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={sessionStartDate}
              onChange={(e) => setSessionStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={sessionEndDate}
              onChange={(e) => setSessionEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Search Button */}
          <div className="flex space-x-2">
            <button
              onClick={handleSessionsSearch}
              disabled={isSearchingSessions}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSearchingSessions ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                'Search'
              )}
            </button>
            {sessionsData && (
              <button
                onClick={resetSessionsFilters}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {sessionsData && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">{sessionsData.totalCount}</span> sessions found
                </p>
              </div>
              <div className="text-xs text-blue-600">
                {sessionsData.filters.startDate && (
                  <span className="inline-block bg-blue-100 px-2 py-1 rounded mr-2">
                    From: {sessionsData.filters.startDate}
                  </span>
                )}
                {sessionsData.filters.endDate && (
                  <span className="inline-block bg-blue-100 px-2 py-1 rounded">
                    To: {sessionsData.filters.endDate}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sessions Table */}
      {sessionsData && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sessions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expert</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meet Link</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessionsData.sessions.map((session) => (
                    <tr key={session._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.startTime} - {session.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{session.expertName}</div>
                        <div className="text-sm text-gray-500">{session.expertEmail}</div>
                        <div className="text-xs text-gray-400">{session.expertPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{session.studentName}</div>
                        <div className="text-sm text-gray-500">{session.studentEmail}</div>
                        <div className="text-xs text-gray-400">{session.studentPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          session.status === 'completed' ? 'bg-green-100 text-green-800' :
                          session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {session.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {session.bookedStatus ? 'Booked' : 'Available'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">Expert: ₹{session.pricing.expertFee}</div>
                        <div className="text-sm text-gray-600">Platform: ₹{session.pricing.platformFee}</div>
                        <div className="text-sm font-medium text-gray-900">Total: ₹{session.pricing.total}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {session.meetLink ? (
                          <a
                            href={session.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                          >
                            Join Meeting
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No link</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {sessionsData.sessions.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No sessions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'experts':
        return renderExpertsTab();
      case 'earnings':
        return renderEarningsTab();
      case 'pending-experts':
        return renderPendingExperts();
      case 'outstanding':
        return renderOutstanding();
      case 'pending-content':
        return renderPendingContent();
      case 'pending-blogs':
        return renderPendingBlogs();
      case 'refunds':
        return <RefundRequestsSection />;
      case 'sessions':
        return renderSessionsTab();
      default:
        return renderPendingExperts();
    }
  };

  const renderExpertsTab = () => {
    return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Experts</h2>

        <div className="flex items-center gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Search by Name or Email"
            value={searchExpertInput || ""}
            onChange={(e) => setsearchExpertInput(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => setsearchExpertQuery(searchExpertInput)}
            className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
          <Search size={16} /></button>

          <button
            onClick={() => { setsearchExpertInput(""); setsearchExpertQuery("");}}
            className="flex items-center gap-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {filteredExperts.length === 0 ? (
        <p className="text-gray-600">No experts to show</p>
      ) : (
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExperts.map((expert) => (
                <tr key={expert._id} className="hover:bg-gray-50 transition">
                  {/* NAME */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {expert.firstName} {expert.lastName}
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {expert.email}
                    </div>
                  </td>

                  {/* TITLE */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {expert.title || expert.expertName}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full
                      bg-blue-50 text-blue-700">
                      {expert.status || "N/A"}
                    </span>
                  </td>

                  {/* ACTION BUTTON */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedExpert(expert);
                        setShowExpertModal(true);
                      }}
                      className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md shadow-sm 
                                hover:bg-indigo-700 transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD THIS BELOW YOUR TABLE (only once) */}
      {showExpertModal && <ExpertDetailsModal expert={selectedExpert} onClose={() => setShowExpertModal(false)} />}
    </div>
  );
  }

  const ExpertDetailsModal = () => {
    let baseUrl = "http://localhost:5173";
    const devType = import.meta.env.VITE_TYPE;
    if (devType === 'production') {
      baseUrl = "https://myindieguru.com";
    }
    console.log("Selected Expert:", selectedExpert);
    if (!selectedExpert) return null;

    const infoBox = "border p-4 rounded-lg bg-gray-50";

    const safe = (value, fallback = "Not yet submitted") => {
      if (value === null || value === undefined || value === "") return fallback;
      return value;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={safe(selectedExpert.profilePicture, "/placeholder-user.jpg")}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                <h2 className="text-2xl font-bold">
                  {safe(selectedExpert.firstName)} {safe(selectedExpert.lastName, "")}
                </h2>
                <p className="text-gray-600">{safe(selectedExpert.email)}</p>
                <p className="text-sm text-gray-500 mt-1">Status: {safe(selectedExpert.status)}</p>
              </div>
            </div>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowExpertModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Close
            </button>
          </div>
          {/* BASIC DETAILS */}
          <div className={infoBox}>
            <h3 className="text-lg font-semibold mb-2">Basic Details</h3>
            <p><b>Title:</b> {safe(selectedExpert.title)}</p>
            <p><b>Phone:</b> {safe(selectedExpert.phoneNo)}</p>
            <p><b>Auth Type:</b> {safe(selectedExpert.authType)}</p>
            <p><b>Email Verified:</b> {selectedExpert.emailVerified ? "Yes" : "No"}</p>
            <p><b>Profile URL:</b> {`${baseUrl}/booking/${selectedExpert._id  }`}</p>
          </div>

          {/* EXPERTISE */}
          <div className={`${infoBox} mt-4`}>
            <h3 className="text-lg font-semibold mb-2">Expertise</h3>
            <p>{selectedExpert.expertise?.length ? selectedExpert.expertise.join(", ") : "Not yet submitted"}</p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Target Audience</h3>
            <p>{selectedExpert.targetAudience?.length ? selectedExpert.targetAudience.join(", ") : "Not yet submitted"}</p>
          </div>

          {/* LINKS */}
          {selectedExpert.links?.length > 0 && (
            <div className={`${infoBox} mt-4`}>
              <h3 className="text-lg font-semibold mb-2">Links</h3>
              {selectedExpert.links.map((link, i) => (
                <p key={i} className="text-blue-600 underline cursor-pointer">
                  {safe(link.name)}: {safe(link.url)}
                </p>
              ))}
            </div>
          )}

          {/* EDUCATION */}
          {selectedExpert.education?.length > 0 && (
            <div className={`${infoBox} mt-4`}>
              <h3 className="text-lg font-semibold mb-3">Education</h3>
              {selectedExpert.education.map((edu, i) => (
                <div key={i} className="mb-4 border-b pb-3">
                  <p><b>Degree:</b> {safe(edu.degree)}</p>
                  <p><b>Institution:</b> {safe(edu.institution)}</p>
                  <p><b>Field:</b> {safe(edu.field)}</p>
                  <p><b>Years:</b> {safe(edu.startYear, "-")} - {safe(edu.endYear, "-")}</p>
                  <p><b>Status:</b> {safe(edu.status)}</p>

                  {edu.documents?.length > 0 ? (
                    <div className="mt-2">
                      <b>Documents:</b>
                      {edu.documents.map((doc, j) => (
                        <p key={j} className="text-blue-600 underline cursor-pointer">
                          {safe(doc.filename)} ({safe(doc.url)})
                        </p>
                      ))}
                    </div>
                  ) : <p><b>Documents:</b> Not yet submitted</p>}
                </div>
              ))}
            </div>
          )}

          {/* CERTIFICATIONS */}
          {selectedExpert.certifications?.length > 0 && (
            <div className={`${infoBox} mt-4`}>
              <h3 className="text-lg font-semibold mb-3">Certifications</h3>
              {selectedExpert.certifications.map((cert, i) => (
                <div key={i} className="mb-3 border-b pb-3">
                  <p><b>Name:</b> {safe(cert.name)}</p>
                  <p><b>Issuer:</b> {safe(cert.issuer)}</p>
                  <p><b>Status:</b> {safe(cert.status)}</p>
                  <p><b>Credential ID:</b> {safe(cert.credentialId)}</p>
                  <p><b>Expiry:</b> {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : "Not yet submitted"}</p>

                  {cert.certificateFile?.url ? (
                    <a href={cert.certificateFile.url} target="_blank" className="text-blue-600 underline">
                      View Certificate
                    </a>
                  ) : <p>Certificate: Not yet submitted</p>}
                </div>
              ))}
            </div>
          )}

          {/* EXPERIENCE */}
          {selectedExpert.experience?.length > 0 && (
            <div className={`${infoBox} mt-4`}>
              <h3 className="text-lg font-semibold mb-2">Experience</h3>
              {selectedExpert.experience.map((exp, i) => (
                <div key={i} className="mb-3 border-b pb-3">
                  <p><b>Title:</b> {safe(exp.title)}</p>
                  <p><b>Company:</b> {safe(exp.company)}</p>
                  <p><b>Duration:</b> {safe(exp.duration)}</p>
                  <p><b>Description:</b> {safe(exp.description)}</p>
                </div>
              ))}
            </div>
          )}

          {/* PRICING */}
          <div className={`${infoBox} mt-4`}>
            <h3 className="text-lg font-semibold mb-2">Session Pricing</h3>
            <p><b>Expert Fee:</b> ₹{safe(selectedExpert.sessionPricing?.expertFee, 0)}</p>
            <p><b>Platform Fee:</b> ₹{safe(selectedExpert.sessionPricing?.platformFee, 0)}</p>
            <p><b>Total:</b> ₹{safe(selectedExpert.sessionPricing?.total, 0)}</p>
            <p><b>Currency:</b> {safe(selectedExpert.sessionPricing?.currency, "INR")}</p>
          </div>

          {/* FEEDBACK */}
          <div className={`${infoBox} mt-4`}>
            <h3 className="text-lg font-semibold mb-2">Feedback Overview</h3>
            <p><b>Rating:</b> ⭐ {safe(selectedExpert.rating, 0)}</p>
            <p><b>Total Feedbacks:</b> {safe(selectedExpert.totalFeedbacks, 0)}</p>
          </div>

          {/* CREATED / UPDATED */}
          <div className="mt-4 text-sm text-gray-600">
            <p><b>Created:</b> {selectedExpert.createdAt ? new Date(selectedExpert.createdAt).toLocaleString() : "Not yet submitted"}</p>
            <p><b>Updated:</b> {selectedExpert.updatedAt ? new Date(selectedExpert.updatedAt).toLocaleString() : "Not yet submitted"}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderEarningsTab = () => (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Earnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="session">Sessions</option>
              <option value="course">Courses</option>
              <option value="cohort">Cohorts</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Search Button */}
          <div className="flex space-x-2">
            <button
              onClick={handleEarningsSearch}
              disabled={isSearching}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSearching ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                'Search'
              )}
            </button>
            {earningsData && (
              <button
                onClick={resetEarningsFilters}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {earningsData && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-800">
                  <span className="font-semibold">{earningsData.transactionCount}</span> transactions found
                </p>
                <p className="text-sm text-green-600">
                  Total platform earnings: <span className="font-semibold">₹{earningsData.totalPlatformFees}</span>
                </p>
              </div>
              <div className="text-xs text-green-600">
                {earningsData.filters.type !== 'all' && (
                  <span className="inline-block bg-green-100 px-2 py-1 rounded mr-2">
                    Type: {earningsData.filters.type}
                  </span>
                )}
                {earningsData.filters.startDate && (
                  <span className="inline-block bg-green-100 px-2 py-1 rounded mr-2">
                    From: {earningsData.filters.startDate}
                  </span>
                )}
                {earningsData.filters.endDate && (
                  <span className="inline-block bg-green-100 px-2 py-1 rounded">
                    To: {earningsData.filters.endDate}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Earnings Summary Cards */}
      {earningsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg shadow-md border border-green-200">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Total Platform Earnings</h4>
            <div className="text-2xl font-bold text-gray-900">₹{earningsData.totalPlatformFees}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-md border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2">From Sessions</h4>
            <div className="text-2xl font-bold text-gray-900">₹{earningsData.sourceEarnings.sessions}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow-md border border-purple-200">
            <h4 className="text-sm font-medium text-purple-800 mb-2">From Courses</h4>
            <div className="text-2xl font-bold text-gray-900">₹{earningsData.sourceEarnings.courses}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg shadow-md border border-orange-200">
            <h4 className="text-sm font-medium text-orange-800 mb-2">From Cohorts</h4>
            <div className="text-2xl font-bold text-gray-900">₹{earningsData.sourceEarnings.cohorts}</div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      {earningsData && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Earnings Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expert</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform Fee</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {earningsData.transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.expertName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">₹{transaction.platformFee}</td>
                    </tr>
                  ))}
                  {earningsData.transactions.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'pending-experts', label: 'Pending Experts' },
                { id: 'outstanding', label: 'Outstanding Payments' },
                { id: 'pending-content', label: 'Pending Content' },
                { id: 'pending-blogs', label: 'Pending Blogs' },
                { id: 'earnings', label: 'Earnings' },
                { id: 'refunds', label: 'Refund Requests' },
                { id: 'sessions', label: 'Sessions' },
                { id: 'experts', label: 'All Experts' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

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
    </div>
  );

}