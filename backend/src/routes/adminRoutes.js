import express from 'express';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import Expert from '../models/Expert.js';
import Session from '../models/Session.js';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import Cohort from '../models/Cohort.js';
import { sendMail } from '../utils/sendMail.js';
import { 
    getCancelledSessions, 
    markRefundProcessed, 
    getRefundRequests,
    approveRefundRequest,
    rejectRefundRequest,
    getAdminEarnings,
    getAdminSessions
} from '../controllers/adminController.js';

const router = express.Router();

// Get all pending experts
router.get('/pending-experts',  async (req, res) => {
    try {
        const pendingExperts = await Expert.find({ 
            status: 'pending',
            isAdmin: { $ne: true } // Exclude admins from the list
        }).select('firstName lastName email title expertise createdAt');
        
        res.status(200).json(pendingExperts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending experts', error: error.message });
    }
});

// Get experts with outstanding amounts
router.get('/experts-outstanding',  async (req, res) => {
    try {
        const expertsWithOutstanding = await Expert.find({
            'outstandingAmount.total': { $gt: 0 }
        }).select('firstName lastName email outstandingAmount');

        res.status(200).json(expertsWithOutstanding);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching experts with outstanding amounts', error: error.message });
    }
});

// Clear outstanding amount for an expert
router.post('/experts/:expertId/clear-outstanding', async (req, res) => {
    try {
        const { expertId } = req.params;
        const expert = await Expert.findById(expertId);

        if (!expert) {
            return res.status(404).json({ message: 'Expert not found' });
        }

        // Reset the outstanding amounts
        expert.outstandingAmount = {
            total: 0,
            sessions: 0,
            courses: 0,
            cohorts: 0
        };

        // Update all pending sessions to completed
     
        await expert.save();
        res.status(200).json({ message: 'Outstanding amount cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing outstanding amount', error: error.message });
    }
});

// Approve expert
router.post('/experts/:expertId/approve', async (req, res) => {
    try {
        const { expertId } = req.params;
        const { sessionPrice, platformFee } = req.body;

        if (!sessionPrice || !platformFee) {
            return res.status(400).json({ message: 'Session price and platform fee are required' });
        }

        const expert = await Expert.findById(expertId);
        if (!expert) {
            return res.status(404).json({ message: 'Expert not found' });
        }    

        expert.status = 'approved';
        expert.sessionPricing = {
            expertFee: sessionPrice,
            platformFee: platformFee,
            total: sessionPrice + platformFee,
            currency: 'INR'
        };

        await expert.save();

        // Send approval email to expert
        if (expert.email) {
            await sendMail({
                to: expert.email,
                subject: 'Congratulations! Your Expert Profile Has Been Approved',
                html: `
                    <table style="width:100%;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
                        <thead style="background-color:#4F46E5;color:white;">
                            <tr><th style="padding:20px;font-size:24px;">IndieGuru - Expert Approval</th></tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding:30px;text-align:center;">
                                <h2 style="color:#10B981;">🎉 Profile Approved!</h2>
                                <p style="font-size:16px;color:#555;">
                                    Congratulations ${expert.firstName}! Your expert profile has been approved and you can now start offering your services to students.
                                </p>
                                
                                <div style="background-color:#f8f9fa;border-radius:8px;padding:20px;margin:20px 0;text-align:left;">
                                    <h3 style="color:#333;margin-bottom:15px;">Your Session Pricing Details:</h3>
                                    <div style="margin:10px 0;">
                                        <strong>Expert Fee:</strong> ₹${sessionPrice} per session
                                    </div>
                                    <div style="margin:10px 0;">
                                        <strong>Platform Fee:</strong> ₹${platformFee} per session
                                    </div>
                                    <div style="margin:10px 0;padding-top:10px;border-top:1px solid #ddd;">
                                        <strong>Total Price for Students:</strong> ₹${sessionPrice + platformFee} per session
                                    </div>
                                </div>

                                <div style="background-color:#e8f5e8;border-radius:8px;padding:15px;margin:20px 0;">
                                    <h3 style="color:#333;margin-bottom:10px;">What's Next?</h3>
                                    <ul style="text-align:left;color:#555;margin:0;padding-left:20px;">
                                        <li>Add your available time slots for 1-on-1 sessions</li>
                                        <li>Create and publish courses</li>
                                        <li>Organize cohorts for group learning</li>
                                        <li>Start receiving bookings from students</li>
                                    </ul>
                                </div>

                                <div style="margin:20px 0;">
                                    <a href="${process.env.FRONTEND_URL}/expert" 
                                       style="display:inline-block;background-color:#4F46E5;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">
                                        Go to Dashboard
                                    </a>
                                </div>

                                <p style="font-size:14px;color:#666;margin-top:20px;">
                                    If you have any questions, please contact our support team.
                                </p>
                            </td></tr>
                            <tr><td style="padding:20px;text-align:center;font-size:12px;color:#999;">
                                © 2025 IndieGuru. All rights reserved.
                            </td></tr>
                        </tbody>
                    </table>
                `
            });
        }
        console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
        console.log(process.env.FRONTEND_URL);
        console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
        res.status(200).json({ message: 'Expert approved successfully', expert });
    } catch (error) {
        console.error('Error approving expert:', error);
        res.status(500).json({ message: 'Error approving expert', error: error.message });
    }
});

// Reject expert
router.post('/experts/:expertId/reject', async (req, res) => {
    try {
        const { expertId } = req.params;
        const { reason } = req.body;

        const expert = await Expert.findById(expertId);
        if (!expert) {
            return res.status(404).json({ message: 'Expert not found' });
        }

        expert.status = 'rejected';
        expert.rejectionReason = reason;
        await expert.save();

        // Send rejection email to expert
        if (expert.email) {
            await sendMail({
                to: expert.email,
                subject: 'Update on Your Expert Profile Application',
                html: `
                    <table style="width:100%;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
                        <thead style="background-color:#4F46E5;color:white;">
                            <tr><th style="padding:20px;font-size:24px;">IndieGuru - Profile Review</th></tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding:30px;text-align:center;">
                                <h2 style="color:#DC2626;">Profile Review Results</h2>
                                <p style="font-size:16px;color:#555;">
                                    Thank you for your interest in becoming an expert on IndieGuru, ${expert.firstName}. 
                                    After careful review, we're unable to approve your profile at this time.
                                </p>
                                
                                <div style="background-color:#fef2f2;border-left:4px solid #DC2626;padding:15px;margin:20px 0;text-align:left;">
                                    <h3 style="color:#DC2626;margin-bottom:10px;">Reason for Rejection:</h3>
                                    <p style="color:#555;margin:0;">${reason}</p>
                                </div>

                                <div style="background-color:#f8f9fa;border-radius:8px;padding:15px;margin:20px 0;">
                                    <h3 style="color:#333;margin-bottom:10px;">Next Steps:</h3>
                                    <ul style="text-align:left;color:#555;margin:0;padding-left:20px;">
                                        <li>Review the feedback provided above</li>
                                        <li>Update your profile information accordingly</li>
                                        <li>Resubmit your application for review</li>
                                        <li>Contact support if you need clarification</li>
                                    </ul>
                                </div>

                                <div style="margin:20px 0;">
                                    <a href="${process.env.FRONTEND_URL}/expert/profile" 
                                       style="display:inline-block;background-color:#4F46E5;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">
                                        Update Profile
                                    </a>
                                </div>

                                <p style="font-size:14px;color:#666;margin-top:20px;">
                                    We appreciate your understanding and look forward to reviewing your updated application.
                                </p>
                            </td></tr>
                            <tr><td style="padding:20px;text-align:center;font-size:12px;color:#999;">
                                © 2025 IndieGuru. All rights reserved.
                            </td></tr>
                        </tbody>
                    </table>
                `
            });
        }

        res.status(200).json({ message: 'Expert rejected successfully', expert });
    } catch (error) {
        console.error('Error rejecting expert:', error);
        res.status(500).json({ message: 'Error rejecting expert', error: error.message });
    }
});

// Get all pending courses and cohorts
router.get('/pending-content',  async (req, res) => {
    try {
        const pendingCourses = await Course.find({ status: 'pending' })
            
        
        const pendingCohorts = await Cohort.find({ status: 'pending' })
           

        res.status(200).json({ 
            courses: pendingCourses,
            cohorts: pendingCohorts
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching pending content', 
            error: error.message 
        });
    }
});

// Approve course
router.post('/courses/:courseId/approve', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { platformPrice } = req.body;

        const course = await Course.findById(courseId).populate('createdBy');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.status = 'approved';
        course.pricing.platformFee = platformPrice;
        course.pricing.total = course.pricing.expertFee + platformPrice;
        await course.save();

        // Send approval email to expert
        if (course.createdBy && course.createdBy.email) {
            await sendMail({
                to: course.createdBy.email,
                subject: 'Your Course Has Been Approved!',
                html: `
                    <table style="width:100%;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
                        <thead style="background-color:#4F46E5;color:white;">
                            <tr><th style="padding:20px;font-size:24px;">IndieGuru - Course Approval</th></tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding:30px;text-align:center;">
                                <h2 style="color:#10B981;">🎉 Course Approved!</h2>
                                <p style="font-size:16px;color:#555;">
                                    Great news ${course.createdBy.firstName}! Your course "${course.title}" has been approved and is now live on our platform.
                                </p>
                                
                                <div style="background-color:#f8f9fa;border-radius:8px;padding:20px;margin:20px 0;text-align:left;">
                                    <h3 style="color:#333;margin-bottom:15px;">Course Pricing Details:</h3>
                                    <div style="margin:10px 0;">
                                        <strong>Course Title:</strong> ${course.title}
                                    </div>
                                    <div style="margin:10px 0;">
                                        <strong>Your Earnings per Sale:</strong> ₹${course.pricing.expertFee}
                                    </div>
                                    <div style="margin:10px 0;">
                                        <strong>Platform Fee:</strong> ₹${platformPrice}
                                    </div>
                                    <div style="margin:10px 0;padding-top:10px;border-top:1px solid #ddd;">
                                        <strong>Total Price for Students:</strong> ₹${course.pricing.expertFee + platformPrice}
                                    </div>
                                </div>

                                <div style="background-color:#e8f5e8;border-radius:8px;padding:15px;margin:20px 0;">
                                    <h3 style="color:#333;margin-bottom:10px;">What's Next?</h3>
                                    <ul style="text-align:left;color:#555;margin:0;padding-left:20px;">
                                        <li>Your course is now visible to students</li>
                                        <li>Students can purchase and access your course content</li>
                                        <li>Track your course performance in the dashboard</li>
                                        <li>Create more courses to expand your offerings</li>
                                    </ul>
                                </div>

                                <div style="margin:20px 0;">
                                    <a href="${process.env.FRONTEND_URL}/expert" 
                                       style="display:inline-block;background-color:#4F46E5;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">
                                        View Dashboard
                                    </a>
                                </div>
                            </td></tr>
                            <tr><td style="padding:20px;text-align:center;font-size:12px;color:#999;">
                                © 2025 IndieGuru. All rights reserved.
                            </td></tr>
                        </tbody>
                    </table>
                `
            });
        }

        res.status(200).json({ 
            message: 'Course approved successfully',
            course 
        });
    } catch (error) {
        console.error('Error approving course:', error);
        res.status(500).json({ 
            message: 'Error approving course', 
            error: error.message 
        });
    }
});

// Approve cohort
router.post('/cohorts/:cohortId/approve', async (req, res) => {
    try {
        const { cohortId } = req.params;
        const { platformPrice } = req.body;

        const cohort = await Cohort.findById(cohortId).populate('createdBy');
        if (!cohort) {
            return res.status(404).json({ message: 'Cohort not found' });
        }

        cohort.status = 'approved';
        cohort.pricing.platformFee = platformPrice;
        cohort.pricing.total = cohort.pricing.expertFee + platformPrice;
        await cohort.save();

        // Send approval email to expert
        if (cohort.createdBy && cohort.createdBy.email) {
            await sendMail({
                to: cohort.createdBy.email,
                subject: 'Your Cohort Has Been Approved!',
                html: `
                    <table style="width:100%;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
                        <thead style="background-color:#4F46E5;color:white;">
                            <tr><th style="padding:20px;font-size:24px;">IndieGuru - Cohort Approval</th></tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding:30px;text-align:center;">
                                <h2 style="color:#10B981;">🎉 Cohort Approved!</h2>
                                <p style="font-size:16px;color:#555;">
                                    Excellent news ${cohort.createdBy.firstName}! Your cohort "${cohort.title}" has been approved and is now available for student enrollment.
                                </p>
                                
                                <div style="background-color:#f8f9fa;border-radius:8px;padding:20px;margin:20px 0;text-align:left;">
                                    <h3 style="color:#333;margin-bottom:15px;">Cohort Details:</h3>
                                    <div style="margin:10px 0;">
                                        <strong>Cohort Title:</strong> ${cohort.title}
                                    </div>
                                    <div style="margin:10px 0;">
                                        <strong>Start Date:</strong> ${new Date(cohort.startDate).toLocaleDateString()}
                                    </div>
                                    <div style="margin:10px 0;">
                                        <strong>End Date:</strong> ${new Date(cohort.endDate).toLocaleDateString()}
                                    </div>
                                    <div style="margin:10px 0;">
                                        <strong>Your Earnings per Student:</strong> ₹${cohort.pricing.expertFee}
                                    </div>
                                    <div style="margin:10px 0;">
                                        <strong>Platform Fee:</strong> ₹${platformPrice}
                                    </div>
                                    <div style="margin:10px 0;padding-top:10px;border-top:1px solid #ddd;">
                                        <strong>Total Price for Students:</strong> ₹${cohort.pricing.expertFee + platformPrice}
                                    </div>
                                </div>

                                <div style="background-color:#e8f5e8;border-radius:8px;padding:15px;margin:20px 0;">
                                    <h3 style="color:#333;margin-bottom:10px;">What's Next?</h3>
                                    <ul style="text-align:left;color:#555;margin:0;padding-left:20px;">
                                        <li>Your cohort is now open for student registration</li>
                                        <li>Monitor enrollment in your dashboard</li>
                                        <li>Prepare your cohort materials and schedule</li>
                                        <li>Students will receive joining instructions before the start date</li>
                                    </ul>
                                </div>

                                <div style="margin:20px 0;">
                                    <a href="${process.env.FRONTEND_URL}/expert" 
                                       style="display:inline-block;background-color:#4F46E5;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">
                                        Manage Cohort
                                    </a>
                                </div>
                            </td></tr>
                            <tr><td style="padding:20px;text-align:center;font-size:12px;color:#999;">
                                © 2025 IndieGuru. All rights reserved.
                            </td></tr>
                        </tbody>
                    </table>
                `
            });
        }

        res.status(200).json({ 
            message: 'Cohort approved successfully',
            cohort 
        });
    } catch (error) {
        console.error('Error approving cohort:', error);
        res.status(500).json({ 
            message: 'Error approving cohort', 
            error: error.message 
        });
    }
});

// Reject course
router.post('/courses/:courseId/reject', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { reason } = req.body;

        const course = await Course.findById(courseId).populate('createdBy');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.status = 'rejected';
        course.rejectionReason = reason;
        await course.save();

        // Send rejection email to expert
        if (course.createdBy && course.createdBy.email) {
            await sendMail({
                to: course.createdBy.email,
                subject: 'Update on Your Course Submission',
                html: `
                    <table style="width:100%;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
                        <thead style="background-color:#4F46E5;color:white;">
                            <tr><th style="padding:20px;font-size:24px;">IndieGuru - Course Review</th></tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding:30px;text-align:center;">
                                <h2 style="color:#DC2626;">Course Review Results</h2>
                                <p style="font-size:16px;color:#555;">
                                    Thank you for submitting your course "${course.title}", ${course.createdBy.firstName}. 
                                    After review, we're unable to approve it at this time.
                                </p>
                                
                                <div style="background-color:#fef2f2;border-left:4px solid #DC2626;padding:15px;margin:20px 0;text-align:left;">
                                    <h3 style="color:#DC2626;margin-bottom:10px;">Reason for Rejection:</h3>
                                    <p style="color:#555;margin:0;">${reason}</p>
                                </div>

                                <div style="background-color:#f8f9fa;border-radius:8px;padding:15px;margin:20px 0;">
                                    <h3 style="color:#333;margin-bottom:10px;">Next Steps:</h3>
                                    <ul style="text-align:left;color:#555;margin:0;padding-left:20px;">
                                        <li>Review the feedback provided above</li>
                                        <li>Update your course content and description</li>
                                        <li>Resubmit your course for review</li>
                                        <li>Contact support if you need assistance</li>
                                    </ul>
                                </div>

                                <div style="margin:20px 0;">
                                    <a href="${process.env.FRONTEND_URL}/expert" 
                                       style="display:inline-block;background-color:#4F46E5;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">
                                        Edit Course
                                    </a>
                                </div>

                                <p style="font-size:14px;color:#666;margin-top:20px;">
                                    We appreciate your effort in creating quality content for our platform.
                                </p>
                            </td></tr>
                            <tr><td style="padding:20px;text-align:center;font-size:12px;color:#999;">
                                © 2025 IndieGuru. All rights reserved.
                            </td></tr>
                        </tbody>
                    </table>
                `
            });
        }

        res.status(200).json({ 
            message: 'Course rejected successfully',
            course 
        });
    } catch (error) {
        console.error('Error rejecting course:', error);
        res.status(500).json({ 
            message: 'Error rejecting course', 
            error: error.message 
        });
    }
});

// Reject cohort
router.post('/cohorts/:cohortId/reject', async (req, res) => {
    try {
        const { cohortId } = req.params;
        const { reason } = req.body;

        const cohort = await Cohort.findById(cohortId).populate('createdBy');
        if (!cohort) {
            return res.status(404).json({ message: 'Cohort not found' });
        }

        cohort.status = 'rejected';
        cohort.rejectionReason = reason;
        await cohort.save();

        // Send rejection email to expert
        if (cohort.createdBy && cohort.createdBy.email) {
            await sendMail({
                to: cohort.createdBy.email,
                subject: 'Update on Your Cohort Submission',
                html: `
                    <table style="width:100%;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
                        <thead style="background-color:#4F46E5;color:white;">
                            <tr><th style="padding:20px;font-size:24px;">IndieGuru - Cohort Review</th></tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding:30px;text-align:center;">
                                <h2 style="color:#DC2626;">Cohort Review Results</h2>
                                <p style="font-size:16px;color:#555;">
                                    Thank you for creating the cohort "${cohort.title}", ${cohort.createdBy.firstName}. 
                                    After review, we're unable to approve it at this time.
                                </p>
                                
                                <div style="background-color:#fef2f2;border-left:4px solid #DC2626;padding:15px;margin:20px 0;text-align:left;">
                                    <h3 style="color:#DC2626;margin-bottom:10px;">Reason for Rejection:</h3>
                                    <p style="color:#555;margin:0;">${reason}</p>
                                </div>

                                <div style="background-color:#f8f9fa;border-radius:8px;padding:15px;margin:20px 0;">
                                    <h3 style="color:#333;margin-bottom:10px;">Next Steps:</h3>
                                    <ul style="text-align:left;color:#555;margin:0;padding-left:20px;">
                                        <li>Review the feedback provided above</li>
                                        <li>Update your cohort details and content</li>
                                        <li>Adjust dates and structure if necessary</li>
                                        <li>Resubmit your cohort for review</li>
                                        <li>Contact support if you need guidance</li>
                                    </ul>
                                </div>

                                <div style="margin:20px 0;">
                                    <a href="${process.env.FRONTEND_URL}/expert" 
                                       style="display:inline-block;background-color:#4F46E5;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">
                                        Edit Cohort
                                    </a>
                                </div>

                                <p style="font-size:14px;color:#666;margin-top:20px;">
                                    We value your contribution to our learning community.
                                </p>
                            </td></tr>
                            <tr><td style="padding:20px;text-align:center;font-size:12px;color:#999;">
                                © 2025 IndieGuru. All rights reserved.
                            </td></tr>
                        </tbody>
                    </table>
                `
            });
        }

        res.status(200).json({ 
            message: 'Cohort rejected successfully',
            cohort 
        });
    } catch (error) {
        console.error('Error rejecting cohort:', error);
        res.status(500).json({ 
            message: 'Error rejecting cohort', 
            error: error.message 
        });
    }
});

// Get cancelled sessions requiring refund
router.get('/cancelled-sessions',  getCancelledSessions);

// Mark session refund as processed
router.post('/sessions/:sessionId/refund-processed',  markRefundProcessed);

// Refund request routes
router.get('/refund-requests', getRefundRequests);
router.post('/sessions/:sessionId/approve-refund', approveRefundRequest);
router.post('/sessions/:sessionId/reject-refund', rejectRefundRequest);

// Add admin earnings route
router.get('/earnings', getAdminEarnings);

// Add admin sessions route
router.get('/sessions', getAdminSessions);

export default router;