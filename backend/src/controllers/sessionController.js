import { google } from 'googleapis';
import Session from '../models/Session.js';
import Expert from '../models/Expert.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { sendMail } from '../utils/sendMail.js';
import { cloudinary } from '../config/cloudinary.js';

export const bookSession = async (req, res) => {
  try {
   
    session.title = sessionTitle || session.title;
    session.studentName = studentName;
    session.bookedStatus = true;
    session.bookedBy = req.user.id;
    session.paymentStatus = 'completed';
    session.status = 'upcoming';

   
   
    console.log("expert.outstandingAmount", expert.outstandingAmount);
    await expert.save();
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
      summary: `Session with ${session.expert.firstName} ${session.expert.lastName}`,
      description: 'Career Counseling Session',
      start: {
        dateTime: new Date(`${session.date.toISOString().split('T')[0]}T${session.startTime}:00`),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: new Date(`${session.date.toISOString().split('T')[0]}T${session.endTime}:00`),
        timeZone: 'Asia/Kolkata',
      },
      conferenceData: {
        createRequest: {
          requestId: `${session._id}-meet`,
        },
      },
      attendees: [
        { email: user.email },
        { email: expert.email },
      ],
    };

    const { data } = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = data.conferenceData.entryPoints.find(entry => entry.entryPointType === 'video').uri;

    session.eventId = data.id;
    session.meetLink = meetLink;
    await session.save();
    await expert.save();

    // Send Email to User
    await sendMail({
      to: user.email,
      subject: 'Session Booking Confirmed!',
      html: `
        <table style="width:100%;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
          <thead style="background-color:#4F46E5;color:white;">
            <tr><th style="padding:20px;font-size:24px;">Platform Name</th></tr>
          </thead>
          <tbody>
            <tr><td style="padding:30px;text-align:center;">
              <h2 style="color:#333;">Session Booked Successfully!</h2>
              <p style="font-size:16px;color:#555;">
                Your session with ${expert.firstName} ${expert.lastName} is booked.<br>
                <strong>Date:</strong> ${session.date.toDateString()}<br>
                <strong>Time:</strong> ${session.startTime} - ${session.endTime}
              </p>
              <a href="${meetLink}" style="display:inline-block;margin-top:20px;padding:12px 24px;background-color:#4F46E5;color:white;text-decoration:none;border-radius:5px;font-size:16px;">
                Join Google Meet
              </a>
            </td></tr>
            <tr><td style="padding:20px;text-align:center;font-size:12px;color:#999;">
              © 2025 Platform Name. All rights reserved.
            </td></tr>
          </tbody>
        </table>
      `
    });

    // Send Email to Expert
    await sendMail({
      to: expert.email,
      subject: 'New Booking Received!',
      html: `
        <table style="width:100%;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
          <thead style="background-color:#4F46E5;color:white;">
            <tr><th style="padding:20px;font-size:24px;">Platform Name</th></tr>
          </thead>
          <tbody>
            <tr><td style="padding:30px;text-align:center;">
              <h2 style="color:#333;">New Session Booked!</h2>
              <p style="font-size:16px;color:#555;">
                A new session is booked by ${user.firstName || 'User'}.<br>
                <strong>Date:</strong> ${session.date.toDateString()}<br>
                <strong>Time:</strong> ${session.startTime} - ${session.endTime}
              </p>
              <a href="${meetLink}" style="display:inline-block;margin-top:20px;padding:12px 24px;background-color:#4F46E5;color:white;text-decoration:none;border-radius:5px;font-size:16px;">
                Join Google Meet
              </a>
            </td></tr>
            <tr><td style="padding:20px;text-align:center;font-size:12px;color:#999;">
              © 2025 Platform Name. All rights reserved.
            </td></tr>
          </tbody>
        </table>
      `
    });

    res.status(200).json({ message: 'Session booked successfully!', meetLink });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};

export const getSessionFeedback = async (req, res) => {
  try {
    const sessions = await Session.find({ 
      status: 'completed',
      feedback: { $exists: true, $ne: null },
      'feedback.rating': { $gt: 0 } // Only get sessions with rating greater than 0
    })
    .populate('expert', 'firstName lastName')
    .populate('bookedBy', 'firstName lastName')
    .sort({ 'feedback.rating': -1 })
    .limit(10);

    res.status(200).json({ 
      success: true,
      sessions: sessions.map(session => ({
        _id: session._id,
        title: `Session with ${session.expert.firstName} ${session.expert.lastName}`,
        feedback: session.feedback,
        rating: session.feedback.rating,
        studentName: session.bookedBy ? `${session.bookedBy.firstName} ${session.bookedBy.lastName}` : 'Anonymous Student'
      }))
    });
  } catch (error) {
    console.error('Error fetching session feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching session feedback',
      error: error.message 
    });
  }
};

export const getPastSessions = async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Find sessions where the date and time are in the past
    const sessions = await Session.find({ 
      bookedBy: req.user.id,
      $or: [
        // If date is earlier than today
        { date: { $lt: new Date(currentDate.toDateString()) } },
        // If date is today but time is in the past
        {
          date: new Date(currentDate.toDateString()),
          endTime: { 
            $lt: currentDate.toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit'
            })
          }
        }
      ]
    })
    .sort({ date: -1, endTime: -1 });

    res.status(200).json({ 
      success: true,
      sessions: sessions.map(session => {
        const hasFeedback = session.feedback && session.feedback.rating > 0;
        return {
          _id: session._id,
          title: session.title,
          expertId: session.expert._id,
          expertName: session.expertName,
          expertTitle: session.expertTitle,
          expertExpertise: session.expertExpertise,
          date: session.date,
          startTime: session.startTime,
          endTime: session.endTime,
          feedback: hasFeedback ? session.feedback : null,
          rating: hasFeedback ? session.feedback.rating : 0,
          notes: session.status === 'completed' ? session.notes : null
        };
      })
    });
  } catch (error) {
    console.error('Error fetching past sessions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching past sessions',
      error: error.message 
    });
  }
};

export const updateSessionFeedback = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { rating, heading, description } = req.body;

    if (rating === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be greater than 0 to submit feedback' 
      });
    }

    if (!rating || !heading || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating, heading, and description are required' 
      });
    }

    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    // Verify that the user was the one who booked this session
    if (session.bookedBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update feedback for this session' 
      });
    }

    // Get expert and update their feedback stats
    const expert = await Expert.findById(session.expert);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    session.feedback = {
      rating,
      studentName: session.studentName || `${req.user.firstName} ${req.user.lastName}`,
      detail: {
        heading,
        description
      }
    };

    // Update expert's feedback stats
    await expert.updateFeedback('sessions', rating);
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      feedback: session.feedback
    });

  } catch (error) {
    console.error('Error updating session feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating feedback',
      error: error.message 
    });
  }
};

export const addNotesAndComplete = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { notes } = req.body;
        const files = req.files || [];

        // console.log('Attempting to complete session:', sessionId);
        // console.log('Files received:', files.map(f => ({ name: f.originalname, type: f.mimetype })));

        const session = await Session.findById(sessionId);
        const expert = await Expert.findById(session.expert);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Upload files to cloudinary if any
        const uploadedFiles = files.map(file => ({
          url: file.path, // Cloudinary URL already assigned by multer-storage-cloudinary
          name: file.originalname,
          type: file.mimetype
        }));
        expert.outstandingAmount.sessions += session.pricing.expertFee;
        expert.outstandingAmount.total += session.pricing.expertFee;
        // console.log('All files uploaded successfully:', uploadedFiles);
        // console.log('typeof uploadedFiles:', typeof uploadedFiles);
        // console.log('Array.isArray(uploadedFiles):', Array.isArray(uploadedFiles));
        // console.log('uploadedFiles[0]:', uploadedFiles[0]);
        // console.log('Schema for notes.files:', session.schema.path('notes.files').instance);
        // console.log('session.schema.path("notes.files"):', session.schema.path('notes.files'));
        // console.log(notes);
        session.notes.text = notes || '';
        session.notes.files = uploadedFiles;
        session.notes.uploadedAt = new Date();
        // console.log('Schema for notes.files:', session.schema.path('notes.files').instance);

        session.status = 'completed';

        await session.save();
        await expert.save();
        // console.log('Session updated successfully with notes and files');

        res.status(200).json({
            success: true,
            message: 'Session completed successfully',
            session
        });
    } catch (error) {
        console.error('Error completing session:', error);
        res.status(500).json({
            success: false,
            message: 'Error completing session',
            error: error.message
        });
    }
};

export const cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId).populate('bookedBy').populate('expert');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status === 'cancelled') {
      return res.status(400).json({ message: 'Session is already cancelled' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed session' });
    }

    session.status = 'cancelled';
    await session.save();

    // Send email to user about cancellation
    await sendMail({
      to: session.bookedBy.email,
      subject: 'Session Cancelled by Expert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #333;">Session Cancellation Notice</h2>
          <p>Your session scheduled for ${new Date(session.date).toLocaleDateString()} at ${session.startTime} has been cancelled by the expert.</p>
          <p>Details:</p>
          <ul>
            <li>Expert: ${session.expert.firstName} ${session.expert.lastName}</li>
            <li>Date: ${new Date(session.date).toLocaleDateString()}</li>
            <li>Time: ${session.startTime} - ${session.endTime}</li>
          </ul>
          <p>Please contact our support team for refund assistance.</p>
          <p>We apologize for any inconvenience caused.</p>
        </div>
      `
    });

    res.status(200).json({ message: 'Session cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling session:', error);
    res.status(500).json({ message: 'Error cancelling session', error: error.message });
  }
};

// Add refund request functionality
export const requestRefund = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;
    const files = req.files || [];

    // Validate reason
    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for the refund request'
      });
    }

    const session = await Session.findById(sessionId).populate('expert');
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify that the user was the one who booked this session
    if (session.bookedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to request refund for this session'
      });
    }

    // If refund was already requested
    if (session.refundRequest && session.refundRequest.isRequested) {
      return res.status(400).json({
        success: false,
        message: 'Refund has already been requested for this session'
      });
    }

    // Process uploaded files
    const uploadedDocs = files.map(file => ({
      url: file.path,
      name: file.originalname,
      type: file.mimetype
    }));

    // Ensure status is correctly spelled before saving
    // Fix any potential typo from "conpleted" to "completed"
    if (session.status === 'conpleted') {
      session.status = 'completed';
    }

    // Update session with refund request
    session.refundRequest = {
      isRequested: true,
      reason,
      requestDate: new Date(),
      supportingDocs: uploadedDocs,
      status: 'pending'
    };

    await session.save();

    // Send email notification to admin
    await sendMail({
      to: process.env.EMAIL_USER|| 'admin@example.com',
      subject: 'New Refund Request Submitted',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #333;">New Refund Request</h2>
          <p>A student has submitted a refund request for a session.</p>
          <p>Session details:</p>
          <ul>
            <li>Session ID: ${session._id}</li>
            <li>Date: ${new Date(session.date).toLocaleDateString()}</li>
            <li>Time: ${session.startTime} - ${session.endTime}</li>
            <li>Expert: ${session.expertName}</li>
            <li>Amount: ₹${session.pricing?.total || 0}</li>
          </ul>
          <p>Reason: ${reason}</p>
          <p>Please check the admin dashboard to review this request.</p>
        </div>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Refund request submitted successfully'
    });
  } catch (error) {
    console.error('Error requesting refund:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting refund',
      error: error.message
    });
  }
};
