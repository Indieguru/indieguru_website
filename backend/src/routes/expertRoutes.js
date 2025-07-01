import expertAuthRoutes from "./expertAuthRoutes.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js"; // Ensure this middleware exists
import Expert from "../models/Expert.js"; // Ensure this model exists and is properly defined
import { 
  matchExperts, 
  addSlot, 
  addBatchSlots,
  getExpertSessions,
  updateSession,
  deleteSession,
  getExpertCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getExpertCohorts,
  createCohort,
  updateCohort,
  deleteCohort,
  getExpertDashboardData,
  addEducation,
  updateEducation,
  addCertification,
  updateCertification,
  deleteEducationDocument,
  deleteCertificationDocument,
  getExpertTransactions,
  getFilteredTransactions,
  addExperience,
  getExpertAvailableSessions,
  getExpertByIdAvailableSessions,
  updateExpertise,
  updateIndustries,
  updateTargetAudience,
  getStudentSessionCount,
  getStudentCourseCount,
  getStudentCohortCount,
  getCompletedSessionsCount,
  updateLinks,
  requestApproval
} from '../controllers/expertController.js';
import expertAuthMiddleware from "../middlewares/expertAuthMiddleware.js";
import upload from '../middlewares/upload.js'; // For image uploads
import { cloudinary } from '../config/cloudinary.js';
import multer from 'multer';

const router = express.Router();

router.use("/auth", expertAuthRoutes);

// Expert dashboard and common routes
router.get('/dashboard', expertAuthMiddleware, getExpertDashboardData);
router.get('/transactions', expertAuthMiddleware, getExpertTransactions);
router.get('/transactions/filter', expertAuthMiddleware, getFilteredTransactions);

router.get('/search', async (req, res) => {
  try {
    const { filter } = req.query;
    
    // If no filter provided, return all approved experts
    if (!filter) {
      const experts = await Expert.find({ status: 'approved' });
      return res.status(200).json({ success: true, data: experts });
    }
    
    // Convert kebab-case filter to readable format for better matching
    // e.g., "software-development" becomes "Software Development"
    const readableFilter = filter
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    console.log('Searching for experts with filter:', filter);
    console.log('Readable filter:', readableFilter);
    
    // Special case handling for specific categories
    let specialCasePatterns = [];
    
    // For AI/ML, add common variations
    if (filter === 'ai-ml') {
      specialCasePatterns = [
        new RegExp('ai', 'i'),
        new RegExp('ml', 'i'),
        new RegExp('artificial intelligence', 'i'),
        new RegExp('machine learning', 'i'),
        new RegExp('deep learning', 'i'),
        new RegExp('neural network', 'i')
      ];
      console.log('Added special case patterns for AI/ML');
    }
    
    // Create regex patterns for both the original filter and readable version
    const filterPattern = new RegExp(filter.replace(/-/g, '[ -]'), 'i'); // Allow spaces or hyphens
    const readablePattern = new RegExp(readableFilter, 'i');
    
    // Build the query with OR conditions
    const orConditions = [
      // Expertise is the primary field we want to match
      { expertise: { $elemMatch: { $regex: readablePattern } } },
      { expertise: { $elemMatch: { $regex: filterPattern } } },
      
      // Title matches are also relevant for expertise
      { title: { $regex: readablePattern } },
      { title: { $regex: filterPattern } },
      
      // Industries can be relevant
      { industries: { $elemMatch: { $regex: readablePattern } } },
      { industries: { $elemMatch: { $regex: filterPattern } } },
    ];
    
    // Add special case patterns if any
    if (specialCasePatterns.length > 0) {
      specialCasePatterns.forEach(pattern => {
        orConditions.push({ expertise: { $elemMatch: { $regex: pattern } } });
        orConditions.push({ title: { $regex: pattern } });
      });
    }
    
    const query = {
      status: 'approved',
      $or: orConditions
    };
    
    console.log('Query:', JSON.stringify(query, null, 2));
    
    const experts = await Expert.find(query);
    console.log(`Found ${experts.length} experts matching the filter`);
    
    // If we found no experts with the exact pattern, try a more lenient search
    if (experts.length === 0) {
      console.log('No experts found with exact match, trying more lenient search');
      
      // Extract keywords from the filter
      const keywords = filter.split('-').filter(k => k.length > 2);
      
      if (keywords.length > 0) {
        const keywordPatterns = keywords.map(keyword => new RegExp(keyword, 'i'));
        
        const lenientQuery = {
          status: 'approved',
          $or: [
            ...keywordPatterns.map(pattern => ({ expertise: { $elemMatch: { $regex: pattern } } })),
            ...keywordPatterns.map(pattern => ({ title: { $regex: pattern } })),
            ...keywordPatterns.map(pattern => ({ industries: { $elemMatch: { $regex: pattern } } }))
          ]
        };
        
        console.log('Lenient query:', JSON.stringify(lenientQuery, null, 2));
        
        const lenientExperts = await Expert.find(lenientQuery);
        console.log(`Found ${lenientExperts.length} experts with lenient search`);
        
        return res.status(200).json({ success: true, data: lenientExperts });
      }
    }
    
    res.status(200).json({ success: true, data: experts });
  } catch (error) {
    console.error('Error in expert search:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Student enrollment statistics routes
router.get('/students/sessions', expertAuthMiddleware, getStudentSessionCount);
router.get('/students/courses', expertAuthMiddleware, getStudentCourseCount);
router.get('/students/cohorts', expertAuthMiddleware, getStudentCohortCount);
router.get('/sessions/completed', expertAuthMiddleware, getCompletedSessionsCount);

// Expert profile update
router.put('/update', expertAuthMiddleware, async (req, res) => {
  try {
    const expertId = req.user.id; // Get ID from authenticated user context
    const updates = req.body;
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Update allowed fields
    if (updates.name) {
      const [firstName, ...lastNameParts] = updates.name.split(" ");
      expert.firstName = firstName;
      expert.lastName = lastNameParts.join(" ");
    }
    if (updates.title) expert.title = updates.title;
    if (updates.phoneNo) expert.phoneNo = updates.phoneNo;
    
    // Validate expertise array - filter out empty strings and invalid values
    if (Array.isArray(updates.expertise)) {
      const validExpertise = [
        'stream_selection',
        'career_counseling',
        'competitive_exams',
        'study_abroad',
        'resume_interview',
        'entrepreneurship',
        'higher_education',
        'career_transition',
        'industry_specific'
      ];
      expert.expertise = updates.expertise.filter(exp => 
        exp && validExpertise.includes(exp.toLowerCase().trim())
      );
    }
    
    if (Array.isArray(updates.industries)) {
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
      expert.industries = updates.industries.filter(ind => 
        ind && validIndustries.map(i => i.toLowerCase()).includes(ind.toLowerCase().trim())
      );
    }

    await expert.save();
    res.status(200).json(expert);
  } catch (error) {
    console.error('Error updating expert profile:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Education routes
router.post('/education', 
  expertAuthMiddleware, 
  upload.array('documents', 5), // Allow up to 5 document uploads
  addEducation
);
router.put('/education/:educationId', 
  expertAuthMiddleware, 
  upload.array('documents', 5),
  updateEducation
);
router.delete('/education/:educationId/documents/:documentId', 
  expertAuthMiddleware, 
  deleteEducationDocument
);

// Experience routes
router.post('/experience', expertAuthMiddleware, addExperience);

// Certification routes - PDF only uploads
router.post('/certification', 
  expertAuthMiddleware, 
  upload.certificate('certificate'), // Use PDF-specific upload middleware
  addCertification
);
router.put('/certification/:certificationId', 
  expertAuthMiddleware, 
  upload.certificate('certificate'),
  updateCertification
);
router.delete('/certification/:certificationId/document', 
  expertAuthMiddleware, 
  deleteCertificationDocument
);

// Expert session management routes
router.get('/sessions', expertAuthMiddleware, getExpertSessions);
router.get('/sessions/available', expertAuthMiddleware, getExpertAvailableSessions);
router.post('/addsession', expertAuthMiddleware, addSlot);
router.post('/addsession/batch', expertAuthMiddleware, addBatchSlots);
router.put('/sessions/:sessionId', expertAuthMiddleware, updateSession);
router.delete('/sessions/:sessionId', expertAuthMiddleware, deleteSession);

// Expert course management routes
router.get('/courses', expertAuthMiddleware, getExpertCourses);
router.post('/courses', expertAuthMiddleware, createCourse);
router.put('/courses/:courseId', expertAuthMiddleware, updateCourse);
router.delete('/courses/:courseId', expertAuthMiddleware, deleteCourse);

// Expert cohort management routes
router.get('/cohorts', expertAuthMiddleware, getExpertCohorts);
router.post('/cohorts', expertAuthMiddleware, createCohort);
router.put('/cohorts/:cohortId', expertAuthMiddleware, updateCohort);
router.delete('/cohorts/:cohortId', expertAuthMiddleware, deleteCohort);

router.get('/match', expertAuthMiddleware, matchExperts);

// Profile picture upload route
router.post('/profile-picture', expertAuthMiddleware, upload.single('image'), async (req, res) => {
  try {
    const expertId = req.user.id;
    const expert = await Expert.findById(expertId);
    
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    expert.profilePicture = req.file.path;
    await expert.save();
    
    res.status(200).json({ 
      message: 'Profile picture updated successfully',
      profilePicture: expert.profilePicture
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Error updating profile picture', error: error.message });
  }
});

// Update expertise route
router.patch('/update-expertise', expertAuthMiddleware, updateExpertise);

router.patch('/update-industries', expertAuthMiddleware, updateIndustries);

router.patch('/update-target-audience', expertAuthMiddleware, updateTargetAudience);

// Add route for updating links
router.patch('/update-links', expertAuthMiddleware, updateLinks);

// Add specific route for ratings before dynamic routes
router.get('/ratings', expertAuthMiddleware, async (req, res) => {
  try {
    const expertId  = req.user.id;
    
    // If expertId is provided, fetch ratings for that specific expert
    if (expertId) {
      const expert = await Expert.findById(expertId).select(' rating totalFeedbacks feedbackStats');
      
      if (!expert) {
        return res.status(404).json({ 
          success: false, 
          message: "Expert not found" 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {
          rating: expert.rating,
          totalFeedbacks: expert.totalFeedbacks,
          feedbackStats: expert.feedbackStats
        }
      });
    }
    
    // If no expertId is provided, fetch all experts' ratings (may want to add pagination for large datasets)
    const experts = await Expert.find()
      .select('firstName lastName rating totalFeedbacks feedbackStats')
      .sort({ rating: -1 }); // Sort by rating descending
    
    const ratingsData = experts.map(expert => ({
      expertId: expert._id,
      name: `${expert.firstName} ${expert.lastName}`,
      rating: expert.rating,
      totalFeedbacks: expert.totalFeedbacks,
      feedbackBreakdown: {
        sessions: {
          count: expert.feedbackStats.sessions.count,
          averageRating: expert.feedbackStats.sessions.count > 0 
            ? (expert.feedbackStats.sessions.totalRating / expert.feedbackStats.sessions.count).toFixed(1) 
            : 0
        },
        courses: {
          count: expert.feedbackStats.courses.count,
          averageRating: expert.feedbackStats.courses.count > 0 
            ? (expert.feedbackStats.courses.totalRating / expert.feedbackStats.courses.count).toFixed(1) 
            : 0
        },
        cohorts: {
          count: expert.feedbackStats.cohorts.count,
          averageRating: expert.feedbackStats.cohorts.count > 0 
            ? (expert.feedbackStats.cohorts.totalRating / expert.feedbackStats.cohorts.count).toFixed(1) 
            : 0
        }
      }
    }));
    
    res.status(200).json({
      success: true,
      count: ratingsData.length,
      data: ratingsData
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
});

// Approval request route
router.post('/request-approval', expertAuthMiddleware, requestApproval);

// Dynamic routes should come last
router.get('/:expertId', async (req, res) => {
  try {
    const { expertId } = req.params;
    const expert = await Expert.findById(expertId)
      .select('firstName lastName email title expertise education experience certifications sessionPricing phoneNo outstandingAmount status rejectionReason createdAt'); // Added more fields
    
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }
    
    res.status(200).json({
      id: expert._id,
      name: `${expert.firstName} ${expert.lastName}`,
      email: expert.email,
      phoneNo: expert.phoneNo,
      title: expert.title,
      expertise: expert.expertise,
      education: expert.education,
      experience: expert.experience,
      certifications: expert.certifications,
      sessionPricing: expert.sessionPricing,
      outstandingAmount: expert.outstandingAmount,
      status: expert.status,
      rejectionReason: expert.rejectionReason,
      createdAt: expert.createdAt
    });
  } catch (error) {
    console.error('Error fetching expert:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get('/:expertId/sessions', getExpertByIdAvailableSessions);

export default router;