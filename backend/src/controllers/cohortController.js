import Cohort from '../models/Cohort.js';
import Expert from '../models/Expert.js';

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
        const cohorts = await Cohort.find({ status: 'approved' });
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