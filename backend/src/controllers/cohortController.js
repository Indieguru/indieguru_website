import Cohort from '../models/Cohort.js';
import Expert from '../models/Expert.js';
import User from '../models/User.js';
import { sendMail } from '../utils/sendMail.js';

export const createCohort = async (req, res) => {
    try {
        const { title, description, meetLink, pricing, startDate, endDate } = req.body;
        const cohort = new Cohort({
            title,
            description,
            meetLink,
            pricing,
            startDate,
            endDate,
            createdBy: req.user.id
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
        const cohorts = await Cohort.find({ 
            // status: 'approved',
            activityStatus: 'live'
        }).sort({ startDate: 1 }); // Sort by startDate in ascending order
        console.log(cohorts.length);
        res.json(cohorts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCohortById = async (req, res) => {
    try {
        const cohort = await Cohort.findById(req.params.id);
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
        if (!cohort.purchasedBy.includes(req.user.id)) {
            return res.status(403).json({ message: 'You must be enrolled in the cohort to leave feedback' });
        }

        // Check if user has already left feedback
        const existingFeedback = cohort.feedback.find(f => f.user.toString() === req.user.id);
        if (existingFeedback) {
            return res.status(400).json({ message: 'You have already left feedback for this cohort' });
        }

        cohort.feedback.push({
            user: req.user.id,
            rating,
            detail: {
                heading,
                description
            }
        });

        await cohort.save();
        res.status(201).json(cohort);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCohortFeedback = async (req, res) => {
    try {
        const cohort = await Cohort.findById(req.params.cohortId)
            .populate('feedback.user', 'firstName lastName');

        if (!cohort) {
            return res.status(404).json({ message: 'Cohort not found' });
        }

        res.json(cohort.feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            expert.outstandingAmount = 0;
        }
        expert.outstandingAmount += cohort.pricing;

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
            
            Your expert ${expert.firstName} ${expert.lastName} will be in touch with more details about the program.
            
            See you in the cohort!
        `;

        const expertEmailContent = `
            A new student has enrolled in your cohort "${cohort.title}"!
            
            Student Details:
            - Name: ${user.firstName} ${user.lastName}
            - Email: ${user.email}
            
            Current enrollment: ${cohort.purchasedBy.length} student(s)
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