import express from 'express';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import Expert from '../models/Expert.js';
import Session from '../models/Session.js';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import Cohort from '../models/Cohort.js';
import { 
    getCancelledSessions, 
    markRefundProcessed, 
    getRefundRequests,
    approveRefundRequest,
    rejectRefundRequest
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
        res.status(200).json({ message: 'Expert approved successfully', expert });
    } catch (error) {
        res.status(500).json({ message: 'Error approving expert', error: error.message });
    }
});

// Reject expert
router.post('/experts/:expertId/reject',  async (req, res) => {
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

        res.status(200).json({ message: 'Expert rejected successfully', expert });
    } catch (error) {
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

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.status = 'approved';
        course.pricing.platformFee = platformPrice;
        await course.save();

        res.status(200).json({ 
            message: 'Course approved successfully',
            course 
        });
    } catch (error) {
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

        const cohort = await Cohort.findById(cohortId);
        if (!cohort) {
            return res.status(404).json({ message: 'Cohort not found' });
        }

        cohort.status = 'approved';
        cohort.pricing.platformFee = platformPrice;
        await cohort.save();

        res.status(200).json({ 
            message: 'Cohort approved successfully',
            cohort 
        });
    } catch (error) {
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

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.status = 'rejected';
        course.rejectionReason = reason;
        await course.save();

        res.status(200).json({ 
            message: 'Course rejected successfully',
            course 
        });
    } catch (error) {
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

        const cohort = await Cohort.findById(cohortId);
        if (!cohort) {
            return res.status(404).json({ message: 'Cohort not found' });
        }

        cohort.status = 'rejected';
        cohort.rejectionReason = reason;
        await cohort.save();

        res.status(200).json({ 
            message: 'Cohort rejected successfully',
            cohort 
        });
    } catch (error) {
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

export default router;