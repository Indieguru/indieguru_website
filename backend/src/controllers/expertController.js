import Session from "../models/Session.js";
import Expert from "../models/Expert.js";
import Course from "../models/Course.js";
import Cohort from "../models/Cohort.js";
import Payment from "../models/Payment.js";
import Withdrawal from "../models/Withdrawal.js";
import CommunityPost from "../models/CommunityPost.js";
import upload from '../middlewares/uploadMiddleware.js';
import cloudinary from 'cloudinary';
import Paymentsss from "../models/Payment.js";

export const addSlot = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const expertId = req.user.id;

    // Basic validations
    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get expert's session pricing and details
    const expert = await Expert.findById(expertId);
    if (!expert.sessionPricing || typeof expert.sessionPricing.expertFee !== 'number') {
      return res.status(400).json({ message: "Please set your session pricing first" });
    }

    // Check if already a slot at same time for this expert
    const existingSlot = await Session.findOne({
      expert: expertId,
      date: new Date(date),
      startTime,
      endTime,
    });

    if (existingSlot) {
      return res.status(400).json({ message: "Slot already exists for this time" });
    }

    const newSlot = new Session({
      expert: expertId,
      expertName: `${expert.firstName} ${expert.lastName}`,
      expertTitle: expert.title,
      expertExpertise: expert.expertise,
      date: new Date(date),
      startTime,
      endTime,
      // Don't set title here - let it be set during booking
      pricing: {
        expertFee: expert.sessionPricing.expertFee,
        platformFee: expert.sessionPricing.platformFee,
        currency: expert.sessionPricing.currency
      },
      status: 'not booked',
      meetLink: 'To be generated', // Will update meet link after booking
    });

    await newSlot.save();

    res.status(201).json({ message: "Slot created successfully", slot: newSlot });

  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Add a new batch creation endpoint for multiple session slots
export const addBatchSlots = async (req, res) => {
  try {
    const { slots } = req.body;
    const expertId = req.user.id;
    
    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: "Slots must be a non-empty array" });
    }

    // Get expert's session pricing and details
    const expert = await Expert.findById(expertId);
    if (!expert.sessionPricing || typeof expert.sessionPricing.expertFee !== 'number') {
      return res.status(400).json({ message: "Please set your session pricing first" });
    }

    let addedCount = 0;
    let duplicateCount = 0;
    const newSlots = [];

    // Process each slot in the batch
    for (const slotData of slots) {
      const { date, startTime, endTime } = slotData;
      
      // Basic validations for each slot
      if (!date || !startTime || !endTime) {
        continue; // Skip invalid slots
      }

      // Check if already a slot at same time for this expert
      const existingSlot = await Session.findOne({
        expert: expertId,
        date: new Date(date),
        startTime,
        endTime,
      });

      if (existingSlot) {
        duplicateCount++;
        continue; // Skip duplicate slots
      }

      // Create new slot
      const newSlot = new Session({
        expert: expertId,
        expertName: `${expert.firstName} ${expert.lastName}`,
        expertTitle: expert.title,
        expertExpertise: expert.expertise,
        date: new Date(date),
        startTime,
        endTime,
        // Don't set title here - let it be set during booking
        pricing: {
          expertFee: expert.sessionPricing.expertFee,
          platformFee: expert.sessionPricing.platformFee,
          currency: expert.sessionPricing.currency
        },
        status: 'not booked',
        meetLink: 'To be generated', // Will update meet link after booking
      });

      newSlots.push(newSlot);
      addedCount++;
    }

    // Save all new slots in a single batch operation
    if (newSlots.length > 0) {
      await Session.insertMany(newSlots);
    }

    res.status(201).json({ 
      message: "Slots created successfully", 
      addedCount,
      duplicateCount,
      totalRequested: slots.length
    });
  } catch (error) {
    console.error('Error creating batch slots:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const matchExperts = async (req, res) => {
  try {
    const { userType, guidanceType, industry } = req.query;

    // Build the query based on user requirements
    let query = {
      status: 'approved' // Only return approved experts
    };

    // Match experts based on target audience
    if (userType) {
      query.targetAudience = userType;
    }

    // Match expertise based on guidance type
    switch (guidanceType) {
      case 'To know about my stream selection':
      case 'Explore more options about my stream':
        query.expertise = 'stream_selection';
        break;
      case 'Career counseling for next steps':
      case 'General Career counseling for next steps':
        query.expertise = 'career_counseling';
        break;
      case 'To know about competitive exams':
      case 'How and where to prepare for competitive exams':
        query.expertise = 'competitive_exams';
        break;
      case 'Assistance with applying for study abroad opportunities':
        query.expertise = 'study_abroad';
        break;
      case 'To know about a particular profession':
        query.expertise = 'industry_specific';
        if (industry) query.industries = industry;
        break;
      case 'Resume building, interview preparation, and job search support':
        query.expertise = 'resume_interview';
        break;
      case 'Entrepreneurship guidance or business mentoring':
        query.expertise = 'entrepreneurship';
        break;
      case 'Learn about doctorate procedures in INDIA':
      case 'Learn about Masters in INDIA':
        query.expertise = 'higher_education';
        break;
      case 'One-on-one expert mentorship to advance my career path':
        query.expertise = 'career_counseling';
        if (industry) query.industries = industry;
        break;
      case 'How to pivot to a different career/Industry':
        query.expertise = 'career_transition';
        if (industry) query.industries = industry;
        break;
    }

    // Find matching experts
    const experts = await Expert.find(query)
      .select('-password -emailOtp -gid')
      .sort({ ratings: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      experts
    });
  } catch (error) {
    console.error('Error matching experts:', error);
    res.status(500).json({
      success: false,
      message: 'Error matching experts',
      error: error.message
    });
  }
};

// Course Management
export const getExpertCourses = async (req, res) => {
  try {
    const expertId = req.user.id;
    const courses = await Course.find({ createdBy: expertId })
      .sort({ publishingDate: -1 });
    
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching expert courses:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, driveLink, expertFee } = req.body;
    const expertId = req.user.id;

    // Basic validation
    if (!title || !description || !driveLink || !expertFee) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert expertFee to number and validate
    const expertFeeNum = Number(expertFee);
    if (isNaN(expertFeeNum) || expertFeeNum < 0) {
      return res.status(400).json({ message: "Expert fee must be a valid number" });
    }

    const newCourse = new Course({
      createdBy: expertId,
      title,
      description,
      driveLink,
      pricing: {
        expertFee: expertFeeNum,
        platformFee: 0, // Platform fee can be set by admin later
        total: expertFeeNum, // Set total equal to expertFee for now
        currency: 'INR'
      }
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updates = req.body;
    const expertId = req.user.id;

    const course = await Course.findOne({ _id: courseId, createdBy: expertId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    Object.assign(course, updates);
    await course.save();

    res.status(200).json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const expertId = req.user.id;

    const course = await Course.findOne({ _id: courseId, createdBy: expertId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(courseId);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Cohort Management
export const getExpertCohorts = async (req, res) => {
  try {
    const expertId = req.user.id;
    const cohorts = await Cohort.find({ createdBy: expertId })
      .sort({ startDate: 1 });
    
    res.status(200).json(cohorts);
  } catch (error) {
    console.error('Error fetching expert cohorts:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const createCohort = async (req, res) => {
  try {
    const { title, description, meetLink, expertFee, startDate, endDate } = req.body;
    const expertId = req.user.id;

    // Basic validation
    if (!title || !description || !meetLink || !expertFee || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert expertFee to number and validate
    const expertFeeNum = Number(expertFee);
    if (isNaN(expertFeeNum) || expertFeeNum < 0) {
      return res.status(400).json({ message: "Expert fee must be a valid number" });
    }

    const newCohort = new Cohort({
      createdBy: expertId,
      title,
      description,
      meetLink,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pricing: {
        expertFee: expertFeeNum,
        platformFee: 0, // Platform fee can be set by admin later
        total: expertFeeNum, // Set total equal to expertFee for now
        currency: 'INR'
      }
    });

    await newCohort.save();
    res.status(201).json({ message: "Cohort created successfully", cohort: newCohort });
  } catch (error) {
    console.error('Error creating cohort:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateCohort = async (req, res) => {
  try {
    const { cohortId } = req.params;
    const updates = req.body;
    const expertId = req.user.id;

    const cohort = await Cohort.findOne({ _id: cohortId, createdBy: expertId });
    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }

    Object.assign(cohort, updates);
    await cohort.save();

    res.status(200).json(cohort);
  } catch (error) {
    console.error('Error updating cohort:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteCohort = async (req, res) => {
  try {
    const { cohortId } = req.params;
    const expertId = req.user.id;

    const cohort = await Cohort.findOne({ _id: cohortId, createdBy: expertId });
    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }

    await Cohort.findByIdAndDelete(cohortId);
    res.status(200).json({ message: "Cohort deleted successfully" });
  } catch (error) {
    console.error('Error deleting cohort:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all sessions for a logged-in expert
export const getExpertSessions = async (req, res) => {
  try {
    const expertId = req.user.id;
    const sessions = await Session.find({ expert: expertId })
      .sort({ date: 1, startTime: 1 });
    
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching expert sessions:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update session details
export const updateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const updates = req.body;
    const expertId = req.user.id;

    const session = await Session.findOne({ _id: sessionId, expert: expertId });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.bookedStatus && (updates.date || updates.startTime || updates.endTime)) {
      return res.status(400).json({ message: "Cannot modify time/date of booked sessions" });
    }

    Object.assign(session, updates);
    await session.save();

    res.status(200).json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete a session
export const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const expertId = req.user.id;

    const session = await Session.findOne({ _id: sessionId, expert: expertId });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.bookedStatus) {
      return res.status(400).json({ message: "Cannot delete booked sessions" });
    }

    await Session.findByIdAndDelete(sessionId);
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get available (unbooked) sessions for a logged-in expert
export const getExpertAvailableSessions = async (req, res) => {
  try {
    const expertId = req.user.id;
    const sessions = await Session.find({ 
      expert: expertId,
      bookedStatus: false,
      date: { $gte: new Date() }
    })
    .sort({ date: 1, startTime: 1 });
    
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching expert available sessions:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getExpertDashboardData = async (req, res) => {
  try {
    // Convert Buffer ID to string if needed and ensure it's a valid ObjectId
    const expertId = req.user.id;
    
    // Get expert's basic info and data
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Get upcoming sessions that are BOOKED with complete student details
    const upcomingSessions = await Session.find({
      expert: expertId,
      bookedStatus: true,  // This is the key change - focusing on bookedStatus first
      date: { $gte: new Date() }
    })
    .populate('bookedBy', 'firstName lastName email phone careerFlow') // Include all needed fields
    .sort({ date: 1, startTime: 1 })
    .limit(5);

    // Calculate total earnings from each source
    const [coursesData, sessionsData, cohortsData] = await Promise.all([
      Course.aggregate([
        { $match: { createdBy: expert._id } },
        { $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: 'itemId',
          as: 'payments'
        }},
        { $unwind: '$payments' },
        { $group: {
          _id: null,
          totalEarnings: { $sum: '$payments.amount' },
          count: { $sum: 1 }
        }}
      ]),
      Session.aggregate([
        { $match: { expert: expert._id, status: 'completed' } },
        { $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: 'itemId',
          as: 'payments'
        }},
        { $unwind: '$payments' },
        { $group: {
          _id: null,
          totalEarnings: { $sum: '$payments.amount' },
          count: { $sum: 1 }
        }}
      ]),
      Cohort.aggregate([
        { $match: { createdBy: expert._id } },
        { $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: 'itemId',
          as: 'payments'
        }},
        { $unwind: '$payments' },
        { $group: {
          _id: null,
          totalEarnings: { $sum: '$payments.amount' },
          count: { $sum: 1 }
        }}
      ])
    ]);

    // Get ratings data
    const sessions = await Session.find({ expert: expertId, status: 'completed' });
    const ratings = sessions.map(session => session.rating).filter(rating => rating != null);
    const ratingsBreakdown = ratings.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});
    
    const averageRating = ratings.length > 0 
      ? ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length 
      : 0;

    // Calculate total students
    const uniqueStudents = await Session.distinct('bookedBy', { 
      expert: expertId,
      bookedStatus: true
    });

    // Fetch community posts count
    const communityPostsCount = await CommunityPost.countDocuments({
      author: expertId,
      authorModel: 'Expert'
    });

    const dashboardData = {
      // Basic Information
      name: `${expert.firstName} ${expert.lastName}`,
      email: expert.email,
      phone: expert.phoneNo,
      title: expert.title || "",
      status: expert.status || "not requested",
      isAdmin: expert.isAdmin || false, // Add isAdmin field
      
      // Profile Details
      profilePicture: expert.profilePicture || "/placeholder-user.jpg",
      profileCompletion: calculateProfileCompletion(expert),
      activeStreak: calculateActiveStreak(sessions),
      expertise: expert.expertise || [],
      industries: expert.industries || [],
      targetAudience: expert.targetAudience || [],
      education: expert.education || [],
      experience: expert.experience || [],
      certifications: expert.certifications || [],
      links: expert.links || [],
      
      // Session Pricing
      sessionPricing: expert.sessionPricing || {
        expertFee: 0,
        platformFee: 0,
        currency: 'INR'
      },
      
      // Session and Course Data with enhanced student details
      upcomingSessions: upcomingSessions.map(session => ({
        _id: session._id, // Include the session ID
        id: session._id,
        title: session.title || 'One-on-One Session',
        date: session.date,
        time: session.startTime,
        startTime: session.startTime, // Include both time formats for compatibility
        endTime: session.endTime,
        students: 1,
        type: '1-on-1',
        studentName: session.bookedBy ? `${session.bookedBy.firstName} ${session.bookedBy.lastName}` : 'Not booked yet',
        // Enhanced student details for SessionDetailsModal
        userEmail: session.bookedBy?.email || session.userEmail,
        userPhone: session.bookedBy?.phone || session.userPhone,
        userCareerFlow: session.bookedBy?.careerFlow || session.userCareerFlow,
        meetLink: session.meetLink || 'To be generated',
        status: session.bookedStatus ? 'booked' : 'not booked'
      })),
      
      earnings: {
        total: calculateTotalEarnings(coursesData, sessionsData, cohortsData),
        thisMonth: calculateMonthlyEarnings(coursesData, sessionsData, cohortsData, 0),
        lastMonth: calculateMonthlyEarnings(coursesData, sessionsData, cohortsData, 1)
      },
      analytics: {
        courses: {
          earnings: coursesData[0]?.totalEarnings || 0,
          monthlyGrowth: calculateGrowthRate(coursesData),
          delivered: coursesData[0]?.count || 0
        },
        sessions: {
          earnings: sessionsData[0]?.totalEarnings || 0,
          monthlyGrowth: calculateGrowthRate(sessionsData),
          delivered: sessionsData[0]?.count || 0
        },
        cohorts: {
          earnings: cohortsData[0]?.totalEarnings || 0,
          monthlyGrowth: calculateGrowthRate(cohortsData),
          delivered: cohortsData[0]?.count || 0
        },
        community: {
          posts: communityPostsCount,
        }
      },
      ratings: {
        overall: parseFloat(averageRating.toFixed(1)),
        total: ratings.length,
        breakdown: ratingsBreakdown
      },
      studentsEnrolled: uniqueStudents.length
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching expert dashboard data:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const expertId = req.user.id;
    const expert = await Expert.findById(expertId);

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Calculate outstanding amounts for each type
    const [sessionsOutstanding, coursesOutstanding, cohortsOutstanding] = await Promise.all([
      Session.aggregate([
        { 
          $match: { 
            expert: expert._id,
            paymentStatus: 'pending'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$pricing.expertFee" }
          }
        }
      ]),
      Course.aggregate([
        {
          $match: {
            createdBy: expert._id,
            status: 'approved'
          }
        },
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'itemId',
            as: 'payments'
          }
        },
        {
          $match: {
            'payments.status': 'pending'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$pricing" }
          }
        }
      ]),
      Cohort.aggregate([
        {
          $match: {
            createdBy: expert._id,
            status: 'approved'
          }
        },
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'itemId',
            as: 'payments'
          }
        },
        {
          $match: {
            'payments.status': 'pending'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$pricing" }
          }
        }
      ])
    ]);

    const outstandingAmount = {
      sessions: sessionsOutstanding[0]?.total || 0,
      courses: coursesOutstanding[0]?.total || 0,
      cohorts: cohortsOutstanding[0]?.total || 0,
      total: (sessionsOutstanding[0]?.total || 0) + 
             (coursesOutstanding[0]?.total || 0) + 
             (cohortsOutstanding[0]?.total || 0)
    };

    // Get upcoming sessions
    const upcomingSessions = await Session.find({
      expert: expertId,
      status: 'upcoming'
    }).sort({ date: 1 }).limit(5);

    // Rest of the existing aggregation code...
    const [coursesData, sessionsData, cohortsData] = await Promise.all([
      // ...existing aggregations...
    ]);

    const dashboardData = {
      name: `${expert.firstName} ${expert.lastName}`,
      email: expert.email,
      phone: expert.phoneNo,
      profileCompletion: calculateProfileCompletion(expert),
      activeStreak: calculateActiveStreak(sessions),
      expertise: expert.expertise || [],
      outstandingAmount,
      industries: expert.industries || [],
      targetAudience: expert.targetAudience || [],
      // ...rest of existing dashboard data...
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching expert dashboard data:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Helper functions
const calculateProfileCompletion = (expert) => {
  // Define all the profile sections that contribute to completion
  const completionSteps = [
    // Basic Info - 1 step
    {
      name: 'basicInfo',
      fields: ['firstName', 'lastName', 'email', 'phoneNo', 'title'],
      required: ['firstName', 'lastName', 'email'],
      weight: 1
    },
    // Profile Picture - 1 step
    {
      name: 'profilePicture',
      complete: !!expert.profilePicture && expert.profilePicture !== "/placeholder-user.jpg",
      weight: 1
    },
    // Expertise - 1 step
    {
      name: 'expertise',
      complete: Array.isArray(expert.expertise) && expert.expertise.length > 0,
      weight: 1
    },
    // Target Audience - 1 step
    {
      name: 'targetAudience',
      complete: Array.isArray(expert.targetAudience) && expert.targetAudience.length > 0,
      weight: 1
    },
    // Links - 1 step
    {
      name: 'links',
      complete: Array.isArray(expert.links) && expert.links.length > 0,
      weight: 1
    },
    // Education - 1 step
    {
      name: 'education',
      complete: Array.isArray(expert.education) && expert.education.length > 0,
      weight: 1
    },
    // Experience - 1 step
    {
      name: 'experience',
      complete: Array.isArray(expert.experience) && expert.experience.length > 0,
      weight: 1
    },
  ];

  // Calculate score for each section
  let totalCompleted = 0;
  let totalWeight = 0;

  for (const step of completionSteps) {
    totalWeight += step.weight;

    if (step.fields) {
      // For sections with multiple fields
      const requiredFields = step.required || step.fields;
      const fieldsCompleted = requiredFields.filter(field => {
        const value = expert[field];
        return value && 
          (typeof value === 'string' ? value.trim() !== '' : true);
      }).length;

      if (fieldsCompleted === requiredFields.length) {
        totalCompleted += step.weight;
      }
    } else if (step.complete) {
      // For sections with a single completion check
      totalCompleted += step.weight;
    }
  }

  // Return the completed steps count, not the percentage
  return totalCompleted;
};

const calculateActiveStreak = (sessions) => {
  // For now, return a placeholder. In real implementation,
  // calculate actual consecutive days of activity
  return 7;
};

const calculateTotalEarnings = (courses, sessions, cohorts) => {
  return (
    (courses[0]?.totalEarnings || 0) + 
    (sessions[0]?.totalEarnings || 0) + 
    (cohorts[0]?.totalEarnings || 0)
  );
};

const calculateMonthlyEarnings = (courses, sessions, cohorts, monthsAgo) => {
  // For now, return placeholder values. In real implementation,
  // filter payments by date range and calculate actual monthly earnings
  return monthsAgo === 0 ? 3500 : 4200;
};

const calculateGrowthRate = (data) => {
  // For now, return placeholder values. In real implementation,
  // calculate actual month-over-month growth
  return Math.floor(Math.random() * 20) + 5;
};

export const addEducation = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { degree, institution, field, startYear, endYear, description } = req.body;
    const files = req.files;

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Validate required fields with better error messages
    const requiredFields = {
      degree: 'Degree',
      institution: 'Institution',
      field: 'Field of study',
      startYear: 'Start year',
      endYear: 'End year'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !req.body[field])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate year values
    if (startYear && endYear && parseInt(startYear) > parseInt(endYear)) {
      return res.status(400).json({
        message: "Start year cannot be greater than end year"
      });
    }

    const educationEntry = {
      degree,
      institution,
      field,
      startYear,
      endYear,
      description: description || '',
      documents: files?.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        mimetype: file.mimetype,
        uploadedAt: new Date()
      })) || []
    };

    if (!expert.education) {
      expert.education = [];
    }
    
    expert.education.push(educationEntry);
    await expert.save();

    res.status(201).json({
      message: "Education added successfully",
      education: educationEntry
    });
  } catch (error) {
    console.error('Error adding education:', error);
    res.status(500).json({ 
      message: "Failed to add education", 
      error: error.message 
    });
  }
};

export const addCertification = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { name, issuer, credentialId, expiryDate } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Certificate PDF file is required" });
    }

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // The file is already uploaded to Cloudinary by multer-storage-cloudinary
    const certificationEntry = {
      name,
      issuer,
      issuedDate: new Date(),
      credentialId,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      certificateFile: {
        url: file.path, // multer-storage-cloudinary sets this to the Cloudinary URL
        publicId: file.filename, // multer-storage-cloudinary sets this to the public ID
        uploadedAt: new Date()
      }
    };

    expert.certifications.push(certificationEntry);
    await expert.save();

    res.status(201).json({
      message: "Certification added successfully",
      certification: certificationEntry
    });
  } catch (error) {
    console.error('Error adding certification:', error);
    res.status(500).json({ 
      message: "Failed to add certification", 
      error: error.message 
    });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { educationId } = req.params;
    const updates = req.body;
    const files = req.files;

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    const educationEntry = expert.education.id(educationId);
    if (!educationEntry) {
      return res.status(404).json({ message: "Education entry not found" });
    }

    // Update fields
    Object.assign(educationEntry, updates);

    // Add new documents if files are uploaded
    if (files?.length) {
      const newDocuments = files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        mimetype: file.mimetype
      }));
      educationEntry.documents.push(...newDocuments);
    }

    await expert.save();
    res.status(200).json({
      message: "Education updated successfully",
      education: educationEntry
    });
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateCertification = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { certificationId } = req.params;
    const updates = req.body;
    const file = req.file;

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    const certificationEntry = expert.certifications.id(certificationId);
    if (!certificationEntry) {
      return res.status(404).json({ message: "Certification not found" });
    }

    // Update basic fields
    if (updates.name) certificationEntry.name = updates.name;
    if (updates.issuer) certificationEntry.issuer = updates.issuer;

    // Update PDF file if provided
    if (file) {
      if (file.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: "Only PDF files are allowed" });
      }

      // Delete old file from Cloudinary if exists
      if (certificationEntry.certificateFile?.publicId) {
        await cloudinary.uploader.destroy(certificationEntry.certificateFile.publicId);
      }

      // Upload new file to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'raw',
        public_id: `certifications/${expertId}_${Date.now()}`,
        tags: ['certification', 'pdf']
      });

      certificationEntry.certificateFile = {
        url: result.secure_url,
        publicId: result.public_id,
        uploadedAt: new Date()
      };
    }

    await expert.save();
    res.status(200).json({
      message: "Certification updated successfully",
      certification: certificationEntry
    });
  } catch (error) {
    console.error('Error updating certification:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteEducationDocument = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { educationId, documentId } = req.params;

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    const educationEntry = expert.education.id(educationId);
    if (!educationEntry) {
      return res.status(404).json({ message: "Education entry not found" });
    }

    educationEntry.documents = educationEntry.documents.filter(
      doc => doc._id.toString() !== documentId
    );

    await expert.save();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error('Error deleting education document:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteCertificationDocument = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { certificationId } = req.params;

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    const certificationEntry = expert.certifications.id(certificationId);
    if (!certificationEntry) {
      return res.status(404).json({ message: "Certification not found" });
    }

    // Delete file from Cloudinary if exists
    if (certificationEntry.certificateFile?.publicId) {
      await cloudinary.uploader.destroy(certificationEntry.certificateFile.publicId);
    }

    // Remove certification entirely
    expert.certifications = expert.certifications.filter(
      cert => cert._id.toString() !== certificationId
    );

    await expert.save();
    res.status(200).json({ message: "Certification deleted successfully" });
  } catch (error) {
    console.error('Error deleting certification:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getExpertTransactions = async (req, res) => {
  try {
    const expertId = req.user.id;

    // Get expert data for outstanding amounts
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Get all payments from Paymentsss database for this expert
    const allPayments = await Paymentsss.find({ expertId: expertId })
      .populate('userId', 'firstName lastName email')
      .populate('itemId')
      .sort({ createdAt: -1 });

    // Calculate lifetime earnings from expertFee
    const lifetimeEarnings = allPayments.reduce((total, payment) => {
      return total + (payment.expertFee || 0);
    }, 0);

    // Calculate earnings by source using expertFee
    const sourceEarnings = {
      courses: 0,
      sessions: 0,
      cohorts: 0
    };

    allPayments.forEach(payment => {
      const expertFee = payment.expertFee || 0;
      if (payment.itemType === 'Course') {
        sourceEarnings.courses += expertFee;
      } else if (payment.itemType === 'Session') {
        sourceEarnings.sessions += expertFee;
      } else if (payment.itemType === 'Cohort') {
        sourceEarnings.cohorts += expertFee;
      }
    });

    // Get outstanding amounts from expert model
    const outstandingAmount = expert.outstandingAmount || {
      total: 0,
      sessions: 0,
      courses: 0,
      cohorts: 0
    };

    // Format recent transactions for the table
    const transactions = allPayments.slice(0, 10).map(payment => {
      const studentName = payment.userId ? 
        `${payment.userId.firstName} ${payment.userId.lastName}` : 
        'Unknown User';
      
      let itemName = 'Unknown Item';
      if (payment.itemId) {
        if (payment.itemType === 'Course') {
          itemName = payment.itemId.title || 'Course';
        } else if (payment.itemType === 'Session') {
          itemName = payment.itemId.title || 'Session';
        } else if (payment.itemType === 'Cohort') {
          itemName = payment.itemId.title || 'Cohort';
        }
      }

      return {
        id: payment._id,
        name: `${studentName} - ${itemName}`,
        type: payment.itemType,
        date: payment.createdAt.toLocaleDateString(),
        amount: payment.expertFee || 0,
        status: 'Completed'
      };
    });

    // Format response
    res.status(200).json({
      lifetimeEarnings,
      sourceEarnings,
      outstandingAmount,
      transactions
    });

  } catch (error) {
    console.error('Error fetching expert transactions:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getFilteredTransactions = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { type, startDate, endDate } = req.query;

    // Build filter query
    let filterQuery = { expertId: expertId };

    // Add type filter if provided
    if (type && type !== 'all') {
      filterQuery.itemType = type.charAt(0).toUpperCase() + type.slice(1);
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      filterQuery.createdAt = {};
      if (startDate) {
        filterQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to include the end date
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        filterQuery.createdAt.$lt = endDateObj;
      }
    }

    // Get filtered payments
    const filteredPayments = await Paymentsss.find(filterQuery)
      .populate('userId', 'firstName lastName email')
      .populate('itemId')
      .sort({ createdAt: -1 });

    // Calculate total earnings from filtered results
    const totalEarnings = filteredPayments.reduce((total, payment) => {
      return total + (payment.expertFee || 0);
    }, 0);

    // Format transactions
    const transactions = filteredPayments.map(payment => {
      const studentName = payment.userId ? 
        `${payment.userId.firstName} ${payment.userId.lastName}` : 
        'Unknown User';
      
      let itemName = 'Unknown Item';
      if (payment.itemId) {
        if (payment.itemType === 'Course') {
          itemName = payment.itemId.title || 'Course';
        } else if (payment.itemType === 'Session') {
          itemName = payment.itemId.title || 'Session';
        } else if (payment.itemType === 'Cohort') {
          itemName = payment.itemId.title || 'Cohort';
        }
      }

      return {
        id: payment._id,
        name: `${studentName} - ${itemName}`,
        type: payment.itemType,
        date: payment.createdAt.toLocaleDateString(),
        amount: payment.expertFee || 0,
        status: 'Completed',
        fullDate: payment.createdAt
      };
    });

    res.status(200).json({
      totalEarnings,
      transactionCount: filteredPayments.length,
      transactions,
      filters: {
        type: type || 'all',
        startDate,
        endDate
      }
    });

  } catch (error) {
    console.error('Error fetching filtered transactions:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const addExperience = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { title, company, duration, description } = req.body;

    // Validate required fields with better error messages
    const requiredFields = {
      title: 'Job title',
      company: 'Company name',
      duration: 'Duration'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !req.body[field])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    const experienceEntry = {
      title,
      company,
      duration,
      description: description || ''
    };

    if (!expert.experience) {
      expert.experience = [];
    }

    expert.experience.push(experienceEntry);
    await expert.save();

    res.status(201).json({
      message: "Experience added successfully",
      experience: experienceEntry
    });
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ 
      message: "Failed to add experience", 
      error: error.message 
    });
  }
};

export const getExpertById = async (req, res) => {
  try {
    const { expertId } = req.params;
    const expert = await Expert.findById(expertId).select('-password -emailOtp -gid');
    
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.status(200).json(expert);
  } catch (error) {
    console.error('Error fetching expert:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getExpertByIdAvailableSessions = async (req, res) => {
  try {
    const { expertId } = req.params;
    const sessions = await Session.find({ 
      expert: expertId,
      bookedStatus: false,
      date: { $gte: new Date() }
    })
    .sort({ date: 1, startTime: 1 });
    
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching expert sessions:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateExpertise = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { expertise } = req.body;

    if (!Array.isArray(expertise)) {
      return res.status(400).json({ message: "Expertise must be an array" });
    }

    const validExpertise = [
     "Stream Selection",
      "Career Counseling",
      "Competitive Exams",
      "Study Abroad",
      "Resume Interview",
      "Entrepreneurship",
      "Higher Education",
     " Career Transition",
      "Industry Specific"
    ];

    const expert = await Expert.findByIdAndUpdate(
      expertId,
      { $set: { expertise: expertise } },
      { new: true }
    ).select('-password -emailOtp -gid');

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.status(200).json({
      message: "Expertise updated successfully",
      expertise: expert.expertise
    });
  } catch (error) {
    console.error('Error updating expertise:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateIndustries = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { industries } = req.body;

    if (!Array.isArray(industries)) {
      return res.status(400).json({ message: "Industries must be an array" });
    }

    const validIndustries = [
      'Technology',
      'Healthcare',
      'Finance',
      'Education',
      'Engineering',
      'Marketing',
      'Design',
      'Business Management',
      'Data Science',
      'Research & Development',
      'Manufacturing',
      'Consulting',
      'Law',
      'Media & Entertainment',
      'Architecture',
      'Life Sciences'
    ];

    const expert = await Expert.findByIdAndUpdate(
      expertId,
      { $set: { industries: industries } },
      { new: true }
    ).select('-password -emailOtp -gid');

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.status(200).json({
      message: "Industries updated successfully",
      industries: expert.industries
    });
  } catch (error) {
    console.error('Error updating industries:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateTargetAudience = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { targetAudience } = req.body;

    if (!Array.isArray(targetAudience)) {
      return res.status(400).json({ message: "Target audience must be an array" });
    }

    const expert = await Expert.findByIdAndUpdate(
      expertId,
      { $set: { targetAudience: targetAudience } },
      { new: true }
    ).select('-password -emailOtp -gid');

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.status(200).json({
      message: "Target audience updated successfully",
      targetAudience: expert.targetAudience
    });
  } catch (error) {
    console.error('Error updating target audience:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Student enrollment statistics endpoints
export const getStudentSessionCount = async (req, res) => {
  try {
    const expertId = req.user.id;
    
    // Count unique students who have booked sessions with this expert
    const count = await Session.distinct('bookedBy', { 
      expert: expertId, 
      bookedStatus: true 
    }).then(students => students.length);
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting session student count:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getStudentCourseCount = async (req, res) => {
  try {
    const expertId = req.user.id;
    
    // Get IDs of all courses created by this expert
    const courses = await Course.find({ createdBy: expertId }).select('_id');
    const courseIds = courses.map(course => course._id);
    
    // Count unique students who have enrolled in any of these courses
    const count = await Payment.distinct('student', { 
      itemId: { $in: courseIds }, 
      itemType: 'course',
      status: 'completed'
    }).then(students => students.length);
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting course student count:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getStudentCohortCount = async (req, res) => {
  try {
    const expertId = req.user.id;
    
    // Get IDs of all cohorts created by this expert
    const cohorts = await Cohort.find({ createdBy: expertId }).select('_id');
    const cohortIds = cohorts.map(cohort => cohort._id);
    
    // Count unique students who have enrolled in any of these cohorts
    const count = await Payment.distinct('student', { 
      itemId: { $in: cohortIds }, 
      itemType: 'cohort',
      status: 'completed'
    }).then(students => students.length);
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting cohort student count:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getCompletedSessionsCount = async (req, res) => {
  try {
    const expertId = req.user.id;
    
    // Count sessions that are completed for this expert
    const count = await Session.countDocuments({ 
      expert: expertId, 
      status: 'completed' 
    });
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting completed sessions count:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateLinks = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { links } = req.body;

    if (!Array.isArray(links)) {
      return res.status(400).json({ message: "Links must be an array" });
    }

    // Validate each link object
    for (const link of links) {
      if (!link.name || !link.url) {
        return res.status(400).json({ 
          message: "Each link must have both a name and URL" 
        });
      }

      // Basic URL validation
      try {
        new URL(link.url);
      } catch (error) {
        return res.status(400).json({ 
          message: `Invalid URL format for link: ${link.name}` 
        });
      }
    }

    const expert = await Expert.findByIdAndUpdate(
      expertId,
      { $set: { links: links } },
      { new: true }
    ).select('-password -emailOtp -gid');

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.status(200).json({
      message: "Links updated successfully",
      links: expert.links
    });
  } catch (error) {
    console.error('Error updating links:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const requestApproval = async (req, res) => {
  try {
    const expertId = req.user.id;
    
    // Find the expert
    const expert = await Expert.findById(expertId);
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }
    
    // Check if expert is already approved or has a pending request
    if (expert.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Your profile is already approved'
      });
    }
    
    if (expert.status === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Your approval request is already pending'
      });
    }
    
    // Check if all required profile sections are completed
    const requiredSections = {
      basicInfo: expert.firstName  && expert.title,
      expertise: expert.expertise && expert.expertise.length > 0,
      experience: expert.experience && expert.experience.length > 0,
      targetAudience: expert.targetAudience && expert.targetAudience.length > 0,
      links: expert.links && expert.links.length > 0
    };
    
    const incompleteFields = Object.keys(requiredSections).filter(key => !requiredSections[key]);
    
    if (incompleteFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required profile sections before requesting approval',
        incompleteFields: incompleteFields
      });
    }
    
    // Update expert status to pending
    expert.status = 'pending';
    expert.approvalRequestedAt = new Date();
    await expert.save();
    
    res.status(200).json({
      success: true,
      message: 'Approval request submitted successfully',
      status: expert.status
    });
    
  } catch (error) {
    console.error('Error requesting approval:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting approval',
      error: error.message
    });
  }
};