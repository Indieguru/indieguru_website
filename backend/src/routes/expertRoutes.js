import expertAuthRoutes from "./expertAuthRoutes.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js"; // Ensure this middleware exists
import Expert from "../models/Expert.js"; // Ensure this model exists and is properly defined
import { 
  matchExperts, 
  addSlot, 
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
  addExperience
} from '../controllers/expertController.js';
import expertAuthMiddleware from "../middlewares/expertAuthMiddleware.js";
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use("/auth", expertAuthRoutes);

// Expert dashboard data
router.get('/dashboard', expertAuthMiddleware, getExpertDashboardData);
router.get('/transactions', expertAuthMiddleware, getExpertTransactions);

// Expert profile update
router.put('/update', expertAuthMiddleware, async (req, res) => {
  try {
    const expertId = req.user.id;
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
    if (updates.expertise) expert.expertise = updates.expertise;

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
  upload.single('certificate'), // Single PDF file upload
  addCertification
);
router.put('/certification/:certificationId', 
  expertAuthMiddleware, 
  upload.single('certificate'),
  updateCertification
);
router.delete('/certification/:certificationId/document', 
  expertAuthMiddleware, 
  deleteCertificationDocument
);

// Expert session management routes
router.get('/sessions', expertAuthMiddleware, getExpertSessions);
router.post('/addsession', expertAuthMiddleware, addSlot);
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

export default router;