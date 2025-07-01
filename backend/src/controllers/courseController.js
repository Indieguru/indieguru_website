import Course from '../models/Course.js';
import User from '../models/User.js';
import Expert from '../models/Expert.js';
import Session from '../models/Session.js';
import Cohort from '../models/Cohort.js';
import { sendMail } from '../utils/sendMail.js';
import Paymentsss from '../models/Payment.js'; // Assuming you have a Payment model for handling payments

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
        // Only return courses that are approved and active
        const courses = await Course.find({ 
            status: 'approved',
            activityStatus: 'live' 
        });
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
        const user = await User.findById(req.user.id);
        if (!user || !user.purchasedCourses.includes(course._id)) {
            return res.status(403).json({ message: 'You must purchase the course to leave feedback' });
        }

        // Check if user has already left feedback
        const existingFeedback = course.feedback.find(f => f.user.toString() === req.user.id);
        if (existingFeedback) {
            return res.status(400).json({ message: 'You have already left feedback for this course' });
        }

        // Add new feedback with user reference
        course.feedback.push({
            user: req.user.id,
            rating,
            studentName: `${user.firstName} ${user.lastName}`,
            detail: {
                heading,
                description
            },
            createdAt: new Date()
        });

        // Update expert's feedback stats
        const expert = await Expert.findById(course.createdBy);
        if (expert) {
            await expert.updateFeedback('courses', rating);
        }

        await course.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Feedback added successfully',
            course 
        });
    } catch (error) {
        console.error('Error adding course feedback:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error adding feedback',
            error: error.message 
        });
    }
};

export const getCourseFeedback = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .populate({
                path: 'feedback.user',
                select: 'firstName lastName'
            });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const feedback = course.feedback.map(f => ({
            id: f._id,
            rating: f.rating,
            detail: f.detail,
            studentName: f.studentName,
            createdAt: f.createdAt,
            user: f.user
        }));

        res.status(200).json({ 
            success: true,
            feedback
        });
    } catch (error) {
        console.error('Error fetching course feedback:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching feedback',
            error: error.message 
        });
    }
};

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const { paymentId } = req.body; 
    
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

    // Create payment entry in Paymentsss database
    const payment = new Paymentsss({
      userId: userId,
      itemId: courseId,
      itemType: 'Course',
      expertId: course.createdBy,
      amount: course.pricing.total || (course.pricing.expertFee + course.pricing.platformFee),
      currency: course.pricing.currency || 'INR',
      paymentId: paymentId || courseId, // Use provided paymentId or courseId as fallback
      expertFee: course.pricing.expertFee,
      platformFee: course.pricing.platformFee
    });

    await payment.save();

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
      expert.outstandingAmount = {
        total: 0,
        sessions: 0,
        courses: 0,
        cohorts: 0
      };
    }
    expert.outstandingAmount.courses += course.pricing.expertFee;
    expert.outstandingAmount.total += course.pricing.expertFee;

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

export const getCombinedTestimonials = async (req, res) => {
  try {
    const [courseFeedbacks, sessionFeedbacks, cohortFeedbacks] = await Promise.all([
      Course.aggregate([
        { $unwind: "$feedback" },
        { $project: { 
          rating: "$feedback.rating",
          content: "$feedback.detail.description",
          heading: "$feedback.detail.heading",
          author: "$feedback.studentName",
          type: { $literal: "Course" },
          title: "$name",
          createdAt: "$feedback.createdAt"
        }}
      ]),
      Session.aggregate([
        { $unwind: "$feedback" },
        { $project: { 
          rating: "$feedback.rating",
          content: "$feedback.detail.description",
          heading: "$feedback.detail.heading",
          author: "$feedback.studentName",
          type: { $literal: "Session" },
          title: "$title",
          createdAt: "$feedback.createdAt"
        }}
      ]),
      Cohort.aggregate([
        { $unwind: "$feedback" },
        { $project: { 
          rating: "$feedback.rating",
          content: "$feedback.detail.description",
          heading: "$feedback.detail.heading",
          author: "$feedback.studentName",
          type: { $literal: "Cohort" },
          title: "$name",
          createdAt: "$feedback.createdAt"
        }}
      ])
    ]);

    // Combine all feedbacks
    let allFeedbacks = [...courseFeedbacks, ...sessionFeedbacks, ...cohortFeedbacks];
    
    // Sort by rating (highest first) and limit to 30
    allFeedbacks = allFeedbacks
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 30);

    res.status(200).json({
      success: true,
      testimonials: allFeedbacks
    });
  } catch (error) {
    console.error('Error in getCombinedTestimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
};

export const markCourseAsCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // Find course and user
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const user = await Expert.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify that the user has purchased the course
       

        // Update the course's activity status to completed
        course.activityStatus = 'completed';
        await course.save();

        res.status(200).json({ 
            success: true,
            message: 'Course marked as completed',
            course
        });
    } catch (error) {
        console.error('Error marking course as completed:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error marking course as completed',
            error: error.message 
        });
    }
};