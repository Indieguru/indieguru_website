import Session from '../models/Session.js';
import Expert from '../models/Expert.js';
import User from '../models/User.js';
import { sendMail } from '../utils/sendMail.js';

export const getCancelledSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'cancelled', refundProcessed: { $ne: true } })
      .populate('bookedBy', 'email phoneNumber')
      .populate('expert', 'email phoneNumber')
      .sort({ date: -1 });

    const formattedSessions = sessions.map(session => ({
      _id: session._id,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      pricing: {
        expertPrice: session.pricing?.expertFee || 0,
        platformPrice: session.pricing?.platformFee || 0,
        totalPrice: (session.pricing?.expertFee || 0) + (session.pricing?.platformFee || 0)
      },
      studentDetails: {
        email: session.bookedBy?.email,
        phone: session.bookedBy?.phoneNumber
      },
      expertDetails: {
        email: session.expert?.email,
        phone: session.expert?.phoneNumber
      }
    }));

    res.status(200).json(formattedSessions);
  } catch (error) {
    console.error('Error fetching cancelled sessions:', error);
    res.status(500).json({ message: 'Error fetching cancelled sessions', error: error.message });
  }
};

export const markRefundProcessed = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId).populate('bookedBy').populate('expert');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.refundProcessed) {
      return res.status(400).json({ message: 'Refund already processed for this session' });
    }

    session.refundProcessed = true;

    // If the session was marked as completed, reduce the expert's outstanding amount
    if (session.status === 'completed' && session.expert) {
      const expert = await Expert.findById(session.expert._id);
      if (expert && expert.outstandingAmount) {
        // Subtract the expert fee from outstanding amount
        const expertFee = session.pricing?.expertFee || 0;
        
      
          expert.outstandingAmount.sessions -= expertFee;
          expert.outstandingAmount.total -= expertFee;
          await expert.save();
        
      }
    }

    await session.save();

    // Send email to student about refund
    if (session.bookedBy && session.bookedBy.email) {
      await sendMail({
        to: session.bookedBy.email,
        subject: 'Refund Processed for Cancelled Session',
        html: `
          <table style="width:100%;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
            <thead style="background-color:#4F46E5;color:white;">
              <tr><th style="padding:20px;font-size:24px;">Platform Name</th></tr>
            </thead>
            <tbody>
              <tr><td style="padding:30px;text-align:center;">
                <h2 style="color:#333;">Refund Processed Successfully</h2>
                <p style="font-size:16px;color:#555;">
                  We're writing to inform you that the refund for your cancelled session has been processed successfully.
                </p>
                <div style="background-color:#f8f8f8;border-radius:8px;padding:15px;margin:20px 0;text-align:left;">
                  <p style="margin:5px 0;"><strong>Session Details:</strong></p>
                  <p style="margin:5px 0;">Date: ${new Date(session.date).toDateString()}</p>
                  <p style="margin:5px 0;">Time: ${session.startTime} - ${session.endTime}</p>
                  <p style="margin:5px 0;">Expert: ${session.expert ? `${session.expert.firstName} ${session.expert.lastName}` : 'N/A'}</p>
                  <p style="margin:5px 0;">Amount Refunded: ₹${session.pricing?.total || 0}</p>
                </div>
                <p style="font-size:14px;color:#666;">
                  The refunded amount should reflect in your account within 5-7 business days, depending on your bank's processing time.
                </p>
                <p style="font-size:14px;color:#666;">
                  If you have any questions or concerns regarding your refund, please contact our support team.
                </p>
              </td></tr>
              <tr><td style="padding:20px;text-align:center;font-size:12px;color:#999;">
                © 2025 Platform Name. All rights reserved.
              </td></tr>
            </tbody>
          </table>
        `
      });
    }

    res.status(200).json({ message: 'Session marked as refunded successfully' });
  } catch (error) {
    console.error('Error marking refund as processed:', error);
    res.status(500).json({ message: 'Error marking refund as processed', error: error.message });
  }
};

// Get all refund requests
export const getRefundRequests = async (req, res) => {
  try {
    const sessions = await Session.find({ 
      'refundRequest.isRequested': true,
      'refundRequest.status': 'pending'
    })
    .populate('bookedBy', 'firstName lastName email phoneNumber')
    .populate('expert', 'firstName lastName email phoneNumber')
    .sort({ 'refundRequest.requestDate': -1 });

    const formattedRequests = sessions.map(session => ({
      _id: session._id,
      title: session.title,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status,
      pricing: session.pricing,
      refundRequest: {
        reason: session.refundRequest.reason,
        requestDate: session.refundRequest.requestDate,
        supportingDocs: session.refundRequest.supportingDocs,
      },
      studentDetails: {
        name: `${session.bookedBy?.firstName || ''} ${session.bookedBy?.lastName || ''}`.trim(),
        email: session.bookedBy?.email,
        phone: session.bookedBy?.phoneNumber
      },
      expertDetails: {
        name: `${session.expert?.firstName || ''} ${session.expert?.lastName || ''}`.trim(),
        email: session.expert?.email,
        phone: session.expert?.phoneNumber
      }
    }));

    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error('Error fetching refund requests:', error);
    res.status(500).json({ message: 'Error fetching refund requests', error: error.message });
  }
};

// Approve refund request
export const approveRefundRequest = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { adminMessage } = req.body;
    
    const session = await Session.findById(sessionId)
      .populate('bookedBy')
      .populate('expert');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (!session.refundRequest || !session.refundRequest.isRequested) {
      return res.status(400).json({ message: 'No refund request found for this session' });
    }

    if (session.refundRequest.status !== 'pending') {
      return res.status(400).json({ message: `Refund request is already ${session.refundRequest.status}` });
    }

    // Fix any potential typo from "conpleted" to "completed"
    if (session.status === 'conpleted') {
      session.status = 'completed';
    }

    // Update session
    session.refundRequest.status = 'approved';
    session.refundRequest.adminMessage = adminMessage || 'Your refund request has been approved';
    session.refundProcessed = true;
    
    // If the session was marked as completed, reduce the expert's outstanding amount
    if (session.status === 'completed' && session.expert) {
      const expert = await Expert.findById(session.expert._id);
      if (expert && expert.outstandingAmount) {
        // Subtract the expert fee from outstanding amount
        const expertFee = session.pricing?.expertFee || 0;
        
        if (expert.outstandingAmount.sessions >= expertFee) {
          expert.outstandingAmount.sessions -= expertFee;
          expert.outstandingAmount.total -= expertFee;
          await expert.save();
        }
      }
    }

    await session.save();

    // Send email to student
    if (session.bookedBy && session.bookedBy.email) {
      await sendMail({
        to: session.bookedBy.email,
        subject: 'Refund Request Approved',
        html: `
          <table style="width:100%;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
            <thead style="background-color:#4F46E5;color:white;">
              <tr><th style="padding:20px;font-size:24px;">Platform Name</th></tr>
            </thead>
            <tbody>
              <tr><td style="padding:30px;text-align:center;">
                <h2 style="color:#333;">Refund Request Approved</h2>
                <p style="font-size:16px;color:#555;">
                  We're pleased to inform you that your refund request has been approved.
                </p>
                <div style="background-color:#f8f8f8;border-radius:8px;padding:15px;margin:20px 0;text-align:left;">
                  <p style="margin:5px 0;"><strong>Session Details:</strong></p>
                  <p style="margin:5px 0;">Date: ${new Date(session.date).toDateString()}</p>
                  <p style="margin:5px 0;">Time: ${session.startTime} - ${session.endTime}</p>
                  <p style="margin:5px 0;">Expert: ${session.expertName}</p>
                  <p style="margin:5px 0;">Amount: ₹${session.pricing?.total || 0}</p>
                </div>
                <p style="font-size:14px;color:#666;">
                  ${session.refundRequest.adminMessage || ''}
                </p>
                <p style="font-size:14px;color:#666;">
                  The refund will be processed to your original payment method and should reflect in your account within 5-7 business days.
                </p>
              </td></tr>
              <tr><td style="padding:20px;text-align:center;font-size:12px;color:#999;">
                © 2025 Platform Name. All rights reserved.
              </td></tr>
            </tbody>
          </table>
        `
      });
    }

    res.status(200).json({ message: 'Refund request approved successfully' });
  } catch (error) {
    console.error('Error approving refund request:', error);
    res.status(500).json({ message: 'Error approving refund request', error: error.message });
  }
};

// Reject refund request
export const rejectRefundRequest = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { adminMessage } = req.body;
    
    if (!adminMessage) {
      return res.status(400).json({ message: 'Please provide a reason for rejection' });
    }

    const session = await Session.findById(sessionId).populate('bookedBy');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (!session.refundRequest || !session.refundRequest.isRequested) {
      return res.status(400).json({ message: 'No refund request found for this session' });
    }

    if (session.refundRequest.status !== 'pending') {
      return res.status(400).json({ message: `Refund request is already ${session.refundRequest.status}` });
    }

    // Update session
    session.refundRequest.status = 'rejected';
    session.refundRequest.adminMessage = adminMessage;
    await session.save();

    // Send email to student
    if (session.bookedBy && session.bookedBy.email) {
      await sendMail({
        to: session.bookedBy.email,
        subject: 'Refund Request Update',
        html: `
          <table style="width:100%;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
            <thead style="background-color:#4F46E5;color:white;">
              <tr><th style="padding:20px;font-size:24px;">Platform Name</th></tr>
            </thead>
            <tbody>
              <tr><td style="padding:30px;text-align:center;">
                <h2 style="color:#333;">Refund Request Update</h2>
                <p style="font-size:16px;color:#555;">
                  We've reviewed your refund request for the session scheduled on ${new Date(session.date).toDateString()}.
                </p>
                <div style="background-color:#f8f8f8;border-radius:8px;padding:15px;margin:20px 0;text-align:left;">
                  <p style="margin:5px 0;"><strong>Session Details:</strong></p>
                  <p style="margin:5px 0;">Date: ${new Date(session.date).toDateString()}</p>
                  <p style="margin:5px 0;">Time: ${session.startTime} - ${session.endTime}</p>
                  <p style="margin:5px 0;">Expert: ${session.expertName}</p>
                </div>
                <p style="font-size:16px;color:#555;">
                  Unfortunately, we are unable to process your refund request for the following reason:
                </p>
                <p style="font-size:15px;color:#333;margin:15px 0;padding:10px;border-left:4px solid #e0e0e0;">
                  ${adminMessage}
                </p>
                <p style="font-size:14px;color:#666;">
                  If you have any questions or would like to discuss this further, please contact our support team.
                </p>
              </td></tr>
              <tr><td style="padding:20px;text-align:center;font-size:12px;color:#999;">
                © 2025 Platform Name. All rights reserved.
              </td></tr>
            </tbody>
          </table>
        `
      });
    }

    res.status(200).json({ message: 'Refund request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting refund request:', error);
    res.status(500).json({ message: 'Error rejecting refund request', error: error.message });
  }
};