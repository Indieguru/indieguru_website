import Course from '../models/Course.js';
import Expert from '../models/Expert.js';

export const createCourse = async (req, res) => {
    try {
        const { title, description, driveLink, expertFee } = req.body;
        const course = new Course({
            title,
            description,
            driveLink,
            createdBy: req.user.id,
            pricing: {
                expertFee: expertFee,
                platformFee: 0 // You can calculate this based on your business logic
            }
        });

        const expert = await Expert.findById(req.user.id);
        if (expert) {
            course.expertName = `${expert.firstName} ${expert.lastName}`;
            course.expertTitle = expert.title;
            course.expertExpertise = expert.expertise;
        }

        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ status: 'approved' });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addFeedback = async (req, res) => {
    try {
        const { rating, heading, description } = req.body;
        const course = await Course.findById(req.params.courseId);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user has purchased the course
        if (!course.purchasedBy.includes(req.user.id)) {
            return res.status(403).json({ message: 'You must purchase the course to leave feedback' });
        }

        // Check if user has already left feedback
        const existingFeedback = course.feedback.find(f => f.user.toString() === req.user.id);
        if (existingFeedback) {
            return res.status(400).json({ message: 'You have already left feedback for this course' });
        }

        course.feedback.push({
            user: req.user.id,
            rating,
            detail: {
                heading,
                description
            }
        });

        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseFeedback = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .populate('feedback.user', 'firstName lastName');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course.feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};