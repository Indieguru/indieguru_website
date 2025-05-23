import express from 'express';

import { submitAssessment, getAssessmentStatus } from '../controllers/assessmentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Submit assessment and get expert recommendations
router.post('/submit',
    authMiddleware,
    submitAssessment
);

// Get user's assessment status and data
router.get('/status', authMiddleware, getAssessmentStatus);

export default router;