import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Calendar, Clock, IndianRupee, RefreshCw, User } from 'lucide-react';
import axiosInstance from '../../config/axios.config';
import { toast } from 'react-toastify';

const CancelledSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCancelledSessions = async () => {
    try {
      const response = await axiosInstance.get('/admin/sessions/cancelled');
      setSessions(response.data);
    } catch (error) {
      toast.error('Failed to fetch cancelled sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelledSessions();
  }, []);

  const handleProcessRefund = async (sessionId) => {
    try {
      const transactionId = prompt('Enter refund transaction ID:');
      if (!transactionId) {
        toast.error('Please provide the refund transaction ID');
        return;
      }

      await axiosInstance.post(`/admin/sessions/${sessionId}/process-refund`, {
        transactionId
      });
      toast.success('Refund processed successfully');
      
      // Update session in list to show refund processed
      setSessions(sessions.map(session => 
        session._id === sessionId 
          ? { ...session, refundProcessed: true }
          : session
      ));
    } catch (error) {
      toast.error('Failed to process refund');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cancelled Sessions</h2>
      
      {sessions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600">No cancelled sessions</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sessions.map((session) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Session Details</h3>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Date: {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Time: {session.startTime} - {session.endTime}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      Student: {session.studentName}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Payment Details</h3>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-600">
                      <IndianRupee className="w-4 h-4 mr-2" />
                      Amount: ₹{session.pricing?.total || 0}
                    </p>
                    <p className="text-gray-600">
                      Expert Fee: ₹{session.pricing?.expertFee || 0}
                    </p>
                    <p className="text-gray-600">
                      Platform Fee: ₹{session.pricing?.platformFee || 0}
                    </p>
                  </div>
                </div>
              </div>

              {!session.refundProcessed && (
                <div className="mt-6 flex items-center justify-end">
                  <Button
                    onClick={() => handleProcessRefund(session._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Process Refund
                  </Button>
                </div>
              )}

              {session.refundProcessed && (
                <div className="mt-6 text-right">
                  <span className="text-green-600 font-medium">
                    Refund processed ✓
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CancelledSessions;