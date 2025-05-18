import express from 'express';
import { expertAuthMiddleware } from '../src/middlewares/expertAuthMiddleware.js';
import { 
  addExperience,
  addEducation,
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
  getExpertTransactions
} from '../src/controllers/expertController.js';

const router = express.Router();

// Expert profile routes
router.post('/experience', expertAuthMiddleware, addExperience);
router.post('/education', expertAuthMiddleware, addEducation);

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