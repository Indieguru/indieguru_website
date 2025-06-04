import Cohort from '../models/Cohort.js';
import Expert from '../models/Expert.js';
import User from '../models/User.js';
import { sendMail } from '../utils/sendMail.js';

export const createCohort = async (req, res) => {
    try {
        const { title, description, meetLink, expertFee, startDate, endDate } = req.body;

        // Basic validation
        if (!title || !description || !meetLink || !expertFee || !startDate || !endDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Convert expertFee to number and validate
        const expertFeeNum = Number(expertFee);
        if (isNaN(expertFeeNum) || expertFeeNum < 0) {
            return res.status(400).json({ message: "Expert fee must be a valid number" });
        }

        const cohort = new Cohort({
            title,
            description,
            meetLink,
            startDate,
            endDate,
            createdBy: req.user.id,
            pricing: {
                expertFee: expertFeeNum,
                platformFee: 0, // Platform fee can be set by admin later
                total: expertFeeNum, // Set total equal to expertFee for now
                currency: 'INR'
            }
        });

        const expert = await Expert.findById(req.user.id);
        if (expert) {
            cohort.expertName = `${expert.firstName} ${expert.lastName}`;
            cohort.expertTitle = expert.title;
            cohort.expertExpertise = expert.expertise;
        }

        await cohort.save();
        res.status(201).json(cohort);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCohorts = async (req, res) => {
    try {
        const cohorts = await Cohort.find()
            .select('+rejectionReason')
            .sort({ startDate: 1 }); // Sort by startDate in ascending order
        
        res.json(cohorts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCohortById = async (req, res) => {
    try {
        const cohort = await Cohort.findById(req.params.id)
            .select('+rejectionReason')
            .populate({
                path: 'feedback.user',
                select: 'firstName lastName'
            });
            
        if (!cohort) {
            return res.status(404).json({ message: 'Cohort not found' });
        }
        res.json(cohort);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addFeedback = async (req, res) => {
    try {
        const { rating, heading, description } = req.body;
        const cohort = await Cohort.findById(req.params.cohortId);
        
        if (!cohort) {
            return res.status(404).json({ message: 'Cohort not found' });
        }

        // Check if user has purchased the cohort
        const user = await User.findById(req.user.id);
        if (!user || !cohort.purchasedBy?.includes(req.user.id)) {
            return res.status(403).json({ message: 'You must be enrolled in the cohort to leave feedback' });
        }

        // Check if user has already left feedback
        const existingFeedback = cohort.feedback?.find(f => f.user.toString() === req.user.id);
        if (existingFeedback) {
            return res.status(400).json({ message: 'You have already left feedback for this cohort' });
        }

        // Add new feedback
        const newFeedback = {
            user: req.user.id,
            rating,
            studentName: `${user.firstName} ${user.lastName}`,
            detail: {
                heading,
                description
            },
            createdAt: new Date()
        };

        if (!cohort.feedback) {
            cohort.feedback = [];
        }
        cohort.feedback.push(newFeedback);

        // Update expert's feedback stats
        const expert = await Expert.findById(cohort.createdBy);
        if (expert) {
            await expert.updateFeedback('cohorts', rating);
        }

        await cohort.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Feedback added successfully',
            feedback: newFeedback
        });
    } catch (error) {
        console.error('Error adding cohort feedback:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error adding feedback',
            error: error.message 
        });
    }
};

export const getCohortFeedback = async (req, res) => {
    try {
        const cohort = await Cohort.findById(req.params.cohortId)
            .populate({
                path: 'feedback.user',
                select: 'firstName lastName'
            });

        if (!cohort) {
            return res.status(404).json({ message: 'Cohort not found' });
        }

        const feedback = cohort.feedback?.map(f => ({
            id: f._id,
            rating: f.rating,
            detail: f.detail,
            studentName: f.studentName,
            createdAt: f.createdAt,
            user: f.user
        })) || [];

        res.status(200).json({ 
            success: true,
            feedback
        });
    } catch (error) {
        console.error('Error fetching cohort feedback:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching feedback',
            error: error.message 
        });
    }
};

export const purchaseCohort = async (req, res) => {
    try {
        const { cohortId } = req.params;
        const userId = req.user.id;

        // Find cohort and user
        const cohort = await Cohort.findById(cohortId);
        if (!cohort) {
            return res.status(404).json({ message: 'Cohort not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const expert = await Expert.findById(cohort.createdBy);
        if (!expert) {
            return res.status(404).json({ message: 'Expert not found' });
        }

        // Check if cohort is already purchased
        if (cohort.purchasedBy?.includes(userId)) {
            return res.status(400).json({ message: 'Already enrolled in this cohort' });
        }

        // Check if cohort is full
        if (cohort.maxParticipants && cohort.purchasedBy?.length >= cohort.maxParticipants) {
            return res.status(400).json({ message: 'Cohort is full' });
        }

        // Add user to cohort's purchasedBy array
        if (!cohort.purchasedBy) {
            cohort.purchasedBy = [];
        }
        cohort.purchasedBy.push(userId);

        // Add cohort to user's purchasedCohorts array
        if (!user.purchasedCohorts) {
            user.purchasedCohorts = [];
        }
        user.purchasedCohorts.push(cohortId);

        // Update expert's outstanding amount
        if (!expert.outstandingAmount) {
            expert.outstandingAmount = {
                total: 0,
                sessions: 0,
                courses: 0,
                cohorts: 0
            };
        }
        expert.outstandingAmount.cohorts += cohort.pricing.expertFee;
        expert.outstandingAmount.total += cohort.pricing.expertFee;

        // Save all changes
        await Promise.all([
            user.save(),
            cohort.save(),
            expert.save()
        ]);

        // Send confirmation emails
        const userEmailContent = `
            Thank you for enrolling in ${cohort.title}!
            
            Cohort Details:
            - Start Date: ${new Date(cohort.startDate).toLocaleDateString()}
            - End Date: ${new Date(cohort.endDate).toLocaleDateString()}
            - Meeting Link: ${cohort.meetLink}
            - Total Amount: ₹${cohort.pricing.total}
            
            Your expert ${expert.firstName} ${expert.lastName} will be in touch with more details about the program.
            
            See you in the cohort!
        `;

        const expertEmailContent = `
            A new student has enrolled in your cohort "${cohort.title}"!
            
            Student Details:
            - Name: ${user.firstName} ${user.lastName}
            - Email: ${user.email}
            
            Current enrollment: ${cohort.purchasedBy.length} student(s)
            Your earnings from this enrollment: ₹${cohort.pricing.expertFee}
            ${cohort.maxParticipants ? `Maximum capacity: ${cohort.maxParticipants} students` : ''}
        `;

        await Promise.all([
            sendMail({
                to: user.email,
                subject: 'Welcome to Your New Cohort!',
                html: userEmailContent
            }),
            sendMail({
                to: expert.email,
                subject: 'New Cohort Enrollment',
                html: expertEmailContent
            })
        ]);

        res.status(200).json({ 
            message: 'Successfully enrolled in cohort',
            cohort: {
                id: cohort._id,
                title: cohort.title,
                meetLink: cohort.meetLink,
                startDate: cohort.startDate
            }
        });
    } catch (error) {
        console.error('Error in purchaseCohort:', error);
        res.status(500).json({ message: 'Error enrolling in cohort', error: error.message });
    }
};