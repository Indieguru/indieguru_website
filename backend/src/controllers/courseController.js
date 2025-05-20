import Course from '../models/Course.js';
import User from '../models/User.js';
import Expert from '../models/Expert.js';
import { sendMail } from '../utils/sendMail.js';

export const createCourse = async (req, res) => {
    try {
        const { title, description, driveLink, expertFee, courseOverview } = req.body;
        const course = new Course({
            title,
            description,
            courseOverview,
            driveLink,
            createdBy: req.user.id,
            pricing: {
                expertFee: expertFee,
                platformFee: 0 // You can calculate this based on your business logic
            },
            activityStatus: 'live',
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
        const courses = await Course.find({ activityStatus: 'live' });
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

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Find course and user
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const expert = await Expert.findById(course.createdBy);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    // Check if course is already purchased
    if (user.purchasedCourses?.includes(courseId)) {
      return res.status(400).json({ message: 'Course already purchased' });
    }

    // Add course to user's purchased courses
    if (!user.purchasedCourses) {
      user.purchasedCourses = [];
    }
    user.purchasedCourses.push(courseId);

    // Add user to course's purchasedBy array
    if (!course.purchasedBy) {
      course.purchasedBy = [];
    }
    course.purchasedBy.push(userId);

    // Update expert's outstanding amount
    if (!expert.outstandingAmount) {
      expert.outstandingAmount = 0;
    }
    expert.outstandingAmount += course.price;

    // Save all changes
    await Promise.all([
      user.save(),
      course.save(),
      expert.save()
    ]);

    // Send confirmation emails
    const userEmailContent = `
      Thank you for purchasing ${course.title}!
      You can now access the course materials through your dashboard.
      Course Link: ${course.driveLink}
    `;

    const expertEmailContent = `
      Your course "${course.title}" has been purchased by a new student.
      Student Name: ${user.firstName} ${user.lastName}
      Student Email: ${user.email}
    `;

    await Promise.all([
      sendMail({
        to: user.email,
        subject: 'Course Purchase Confirmation',
        html: userEmailContent
      }),
      sendMail({
        to: expert.email,
        subject: 'New Course Purchase',
        html: expertEmailContent
      })
    ]);

    res.status(200).json({ 
      message: 'Course purchased successfully',
      course: {
        id: course._id,
        title: course.title,
        driveLink: course.driveLink
      }
    });
  } catch (error) {
    console.error('Error in purchaseCourse:', error);
    res.status(500).json({ message: 'Error purchasing course', error: error.message });
  }
};