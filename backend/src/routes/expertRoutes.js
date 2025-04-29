import expertAuthRoutes from "./expertAuthRoutes.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js"; // Ensure this middleware exists
import Expert from "../models/Expert.js"; // Ensure this model exists and is properly defined
import { matchExperts } from '../controllers/expertController.js';

const router = express.Router();

router.use("/auth", expertAuthRoutes);

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const expert = await Expert.findById(req.user.id)
      .select('-password -emailOtp -gid -refreshToken');
    
    if (!expert) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expert profile not found' 
      });
    }

    // Add computed fields
    const enhancedExpert = {
      ...expert.toObject(),
      profileCompletion: calculateProfileCompletion(expert),
      ratings: expert.ratings || 4.5,
      activeStreak: expert.activeStreak || 0,
      avgCategoryRating: expert.avgCategoryRating || 4.3,
      studentsEnrolled: expert.studentsEnrolled || 0,
      earnings: expert.earnings || 0,
      analytics: {
        courses: { delivered: expert.coursesDelivered || 0, earnings: expert.courseEarnings || 0 },
        sessions: { delivered: expert.sessionsDelivered || 0, earnings: expert.sessionEarnings || 0 },
        cohorts: { delivered: expert.cohortsDelivered || 0, earnings: expert.cohortEarnings || 0 }
      },
      upcomingSessions: [] // You'll need to populate this from your sessions collection
    };

    res.status(200).json({ 
      success: true, 
      expert: enhancedExpert 
    });
  } catch (error) {
    console.error('Error fetching expert profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching expert profile',
      error: error.message 
    });
  }
});

router.get('/match', authMiddleware, matchExperts);

router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { filter } = req.query; 

 
    const query = {
      $or: [
        { domain: { $regex: `.*${filter}.*`, $options: "i" } }, // Case-insensitive match
        { name: { $regex: `.*${filter}.*`, $options: "i" } },
        { description: { $regex: `.*${filter}.*`, $options: "i" } },
      ],
    };

  
    const experts = await Expert.find(query);

    res.status(200).json({ success: true, data: experts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

function calculateProfileCompletion(expert) {
  const requiredFields = [
    'firstName', 
    'lastName', 
    'email', 
    'expertise',
    'domain',
    'description'
  ];
  
  const optionalFields = [
    'education',
    'experience',
    'certifications',
    'skills',
    'profilePicture'
  ];

  let score = 0;
  let total = requiredFields.length + optionalFields.length;

  // Check required fields
  requiredFields.forEach(field => {
    if (expert[field] && 
      (Array.isArray(expert[field]) ? expert[field].length > 0 : true)) {
      score += 1;
    }
  });

  // Check optional fields
  optionalFields.forEach(field => {
    if (expert[field] && 
      (Array.isArray(expert[field]) ? expert[field].length > 0 : true)) {
      score += 1;
    }
  });

  return Math.round((score / total) * 100);
}

export default router;