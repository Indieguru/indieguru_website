import express from 'express';
import { createCourse, getCourses, getCourseById, addFeedback, getCourseFeedback, purchaseCourse } from '../controllers/courseController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import expertAuthMiddleware from '../middlewares/expertAuthMiddleware.js';

const router = express.Router();

router.post('/', expertAuthMiddleware, createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/:courseId/feedback', authMiddleware, addFeedback);
router.get('/:courseId/feedback', getCourseFeedback);
router.post('/:courseId/purchase', authMiddleware, purchaseCourse);

export default router;