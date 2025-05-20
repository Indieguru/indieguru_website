import { google } from 'googleapis';
import Session from '../models/Session.js';
import Expert from '../models/Expert.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { sendMail } from '../utils/sendMail.js';

export const bookSession = async (req, res) => {
  try {
      console.log(req.user)
      const { sessionId } = req.params;
      const sanitizedSessionId = sessionId.trim(); 
      const { sessionTitle } = req.body;
      console.log("sessionId", sessionId);
    const user = await User.findById(req.user.id);
    const session = await Session.findById(sanitizedSessionId).populate('expert');

    studentName = req.body.studentName || user.firstName || user.lastName || 'Anonymous Student'; // Default to user's name if not provided
    const expert = await Expert.findById(session.expert);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    if (session.bookedStatus) {
      return res.status(400).json({ message: 'Session already booked' });
    }
    session.title = sessionTitle || session.title; // Update session title if provided
    session.studentName = studentName || `${user.firstName} ${user.lastName}`; // Set student name
    session.bookedStatus = true;
    session.bookedBy = req.user.id;
    session.paymentStatus = 'completed';
    session.status = 'upcoming';

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
      rating: { $exists: true, $ne: null }
    })
    .populate('expert', 'firstName lastName')
    .populate('bookedBy', 'firstName lastName')
    .sort({ rating: -1 })
    .limit(10);

    res.status(200).json({ 
      success: true,
      sessions: sessions.map(session => ({
        _id: session._id,
        title: `Session with ${session.expert.firstName} ${session.expert.lastName}`,
        feedback: session.feedback,
        rating: session.rating,
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
