import Session from "../models/Session.js";
import Expert from "../models/Expert.js";
import Course from "../models/Course.js";
import Cohort from "../models/Cohort.js";
import Payment from "../models/Payment.js";
import Withdrawal from "../models/Withdrawal.js";
import upload from '../middlewares/uploadMiddleware.js';

export const addSlot = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const expertId = req.user.id;

    // Basic validations
    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get expert's session pricing
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
      date: new Date(date),
      startTime,
      endTime,
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

export const matchExperts = async (req, res) => {
  try {
    const { userType, guidanceType, industry } = req.query;

    // Build the query based on user requirements
    let query = {};

    // Match experts based on target audience
    query.targetAudience = userType;

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
    const { title, description, meetLink, pricing, startDate, endDate } = req.body;
    const expertId = req.user.id;

    const newCohort = new Cohort({
      createdBy: expertId,
      title,
      description,
      meetLink,
      pricing,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
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

export const getExpertDashboardData = async (req, res) => {
  try {
    // Convert Buffer ID to string if needed and ensure it's a valid ObjectId
    const expertId = req.user.id;
    
    // Get expert's basic info and data
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Get upcoming sessions
    const upcomingSessions = await Session.find({
      expert: expertId,
      status: 'upcoming',
      date: { $gte: new Date() }
    }).sort({ date: 1, startTime: 1 }).limit(5);

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

    const dashboardData = {
      // Basic Information
      name: `${expert.firstName} ${expert.lastName}`,
      email: expert.email,
      phone: expert.phoneNo,
      title: expert.title || "",
      
      // Profile Details
      profileCompletion: calculateProfileCompletion(expert),
      activeStreak: calculateActiveStreak(sessions),
      expertise: expert.expertise || [],
      education: expert.education || [],
      experience: expert.experience || [],
      certifications: expert.certifications || [],
      
      // Session and Course Data
      upcomingSessions: upcomingSessions.map(session => ({
        id: session._id,
        title: session.title || 'One-on-One Session',
        date: session.date,
        time: session.startTime,
        students: 1,
        type: '1-on-1'
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
  const requiredFields = ['firstName', 'lastName', 'email', 'expertise'];
  const optionalFields = ['education', 'experience', 'certifications'];
  
  let score = 0;
  let total = requiredFields.length + optionalFields.length;

  requiredFields.forEach(field => {
    if (expert[field] && (
      !Array.isArray(expert[field]) || 
      expert[field].length > 0
    )) score++;
  });

  optionalFields.forEach(field => {
    if (expert[field] && (
      !Array.isArray(expert[field]) || 
      expert[field].length > 0
    )) score++;
  });

  return Math.round((score / total) * 100);
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
    const file = req.file; // Single PDF file upload

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

    const certificationEntry = {
      name,
      issuer,
      issuedDate: new Date(),
      credentialId,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      certificateFile: {
        url: `/uploads/${file.filename}`,
        filename: file.filename,
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
    res.status(500).json({ message: "Internal Server Error", error: error.message });
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
      certificationEntry.certificateFile = {
        url: `/uploads/${file.filename}`,
        filename: file.filename,
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
    const { certificationId, documentId } = req.params;

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    const certificationEntry = expert.certifications.id(certificationId);
    if (!certificationEntry) {
      return res.status(404).json({ message: "Certification not found" });
    }

    certificationEntry.documents = certificationEntry.documents.filter(
      doc => doc._id.toString() !== documentId
    );

    await expert.save();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error('Error deleting certification document:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getExpertTransactions = async (req, res) => {
  try {
    const expertId = req.user.id;

    // Get last 6 months of earnings data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [transactions, withdrawals] = await Promise.all([
      Payment.find({ 
        expert: expertId,
        createdAt: { $gte: sixMonthsAgo }
      }).sort({ createdAt: -1 }),
      
      Withdrawal.find({ 
        expert: expertId,
        createdAt: { $gte: sixMonthsAgo }
      }).sort({ createdAt: -1 })
    ]);

    // Calculate monthly earnings
    const monthlyEarnings = await Payment.aggregate([
      { 
        $match: { 
          expert: expertId,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    // Calculate weekly earnings for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const weeklyEarnings = await Payment.aggregate([
      { 
        $match: { 
          expert: expertId,
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: { 
            week: { $week: "$createdAt" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.week": -1 } }
    ]);

    // Calculate incentives based on performance
    const incentives = [];
    const currentMonth = new Date().getMonth();
    const monthTotal = monthlyEarnings.find(m => m._id.month === currentMonth + 1)?.total || 0;

    if (monthTotal > 5000) {
      incentives.push({
        type: 'Monthly Milestone',
        amount: 200,
        description: 'Earned for crossing $5000 in monthly earnings'
      });
    }

    // Format response
    res.status(200).json({
      transactions,
      withdrawals,
      monthlyEarnings,
      weeklyEarnings,
      incentives
    });

  } catch (error) {
    console.error('Error fetching expert transactions:', error);
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

export const getExpertAvailableSessions = async (req, res) => {
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