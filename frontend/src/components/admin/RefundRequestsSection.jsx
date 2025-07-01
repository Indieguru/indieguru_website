import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Download, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import axiosInstance from '../../config/axios.config';
import { toast } from 'react-toastify';

const RefundRequestsSection = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [cancelledSessions, setCancelledSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [activeSection, setActiveSection] = useState('refund-requests');

  useEffect(() => {
    fetchRefundRequests();
    fetchCancelledSessions();
  }, []);

  const fetchRefundRequests = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/refund-requests');
      setRefundRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch refund requests');
      console.error('Error fetching refund requests:', error);
    } finally {
      setLoading(false);
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

  const handleApproveRequest = async (requestId) => {
    try {
      await axiosInstance.post(`/admin/sessions/${requestId}/approve-refund`);
      toast.success('Refund request approved successfully');
      // Remove from list
      setRefundRequests(refundRequests.filter(req => req._id !== requestId));
    } catch (error) {
      toast.error('Failed to approve refund request');
      console.error('Error approving refund request:', error);
    }
  };

  const handleRejectRequest = async () => {
    try {
      if (!selectedRequest || !rejectionReason.trim()) {
        toast.error('Please provide a reason for rejection');
        return;
      }

      await axiosInstance.post(`/admin/sessions/${selectedRequest._id}/reject-refund`, {
        adminMessage: rejectionReason
      });
      
      toast.success('Refund request rejected successfully');
      // Remove from list
      setRefundRequests(refundRequests.filter(req => req._id !== selectedRequest._id));
      // Reset state
      setSelectedRequest(null);
      setRejectionReason('');
      setShowRejectionModal(false);
    } catch (error) {
      toast.error('Failed to reject refund request');
      console.error('Error rejecting refund request:', error);
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

  const openRejectionModal = (request) => {
    setSelectedRequest(request);
    setShowRejectionModal(true);
  };

  const handleImagePreview = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveSection('refund-requests')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeSection === 'refund-requests'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Refund Requests ({refundRequests.length})
            </button>
            <button
              onClick={() => setActiveSection('cancelled-sessions')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeSection === 'cancelled-sessions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cancelled Sessions ({cancelledSessions.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Refund Requests Section */}
      {activeSection === 'refund-requests' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Refund Requests</h2>
          
          {refundRequests.length === 0 ? (
            <p className="text-gray-600">No pending refund requests</p>
          ) : (
            <div className="space-y-6">
              {refundRequests.map((request) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{request.title}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Date: {new Date(request.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Time: {request.startTime} - {request.endTime}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>Session Status: {request.status}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-1">Expert Information</h4>
                        <p className="text-sm text-gray-600">Name: {request.expertDetails.name}</p>
                        <p className="text-sm text-gray-600">Email: {request.expertDetails.email}</p>
                        <p className="text-sm text-gray-600">Phone: {request.expertDetails.phone || 'N/A'}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-1">Student Information</h4>
                        <p className="text-sm text-gray-600">Name: {request.studentDetails.name}</p>
                        <p className="text-sm text-gray-600">Email: {request.studentDetails.email}</p>
                        <p className="text-sm text-gray-600">Phone: {request.studentDetails.phone || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-1">Refund Information</h4>
                        <div className="bg-white p-3 rounded border">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Expert Fee:</span>
                            <span>₹{request.pricing?.expertFee || 0}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Platform Fee:</span>
                            <span>₹{request.pricing?.platformFee || 0}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Total Amount:</span>
                            <span>₹{request.pricing?.total || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-1">Reason for Refund</h4>
                        <div className="bg-white p-3 rounded border">
                          <p className="text-gray-800">{request.refundRequest.reason}</p>
                        </div>
                      </div>
                      
                      {request.refundRequest.supportingDocs && request.refundRequest.supportingDocs.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-1">Supporting Documents</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {request.refundRequest.supportingDocs.map((doc, index) => (
                              <div
                                key={index}
                                className="bg-white p-2 rounded border flex items-center justify-between cursor-pointer hover:bg-gray-100"
                                onClick={() => handleImagePreview(doc.url)}
                              >
                                <span className="text-sm truncate">{doc.name}</span>
                                <Download className="w-4 h-4 text-gray-500" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproveRequest(request._id)}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve Refund
                        </Button>
                        <Button
                          onClick={() => openRejectionModal(request)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cancelled Sessions Section */}
      {activeSection === 'cancelled-sessions' && (
        <div className="bg-white rounded-lg shadow p-6">
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
                          Mark Refund Done
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">Reject Refund Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectRequest}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundRequestsSection;