import express from 'express';
import { createCourse, getCourses, getCourseById, addFeedback, getCourseFeedback } from '../controllers/courseController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import expertAuthMiddleware from '../middlewares/expertAuthMiddleware.js';

const router = express.Router();

router.post('/', expertAuthMiddleware, createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/:courseId/feedback', authMiddleware, addFeedback);
router.get('/:courseId/feedback', getCourseFeedback);

export default router;