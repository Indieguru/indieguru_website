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
  getExpertTransactions
} from '../controllers/expertController.js';
import expertAuthMiddleware from "../middlewares/expertAuthMiddleware.js";
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use("/auth", expertAuthRoutes);

// Expert dashboard data
router.get('/dashboard', expertAuthMiddleware, getExpertDashboardData);
router.get('/transactions', expertAuthMiddleware, getExpertTransactions);

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