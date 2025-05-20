import express from 'express';
import { createCohort, getCohorts, getCohortById, addFeedback, getCohortFeedback } from '../controllers/cohortController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import expertAuthMiddleware from '../middlewares/expertAuthMiddleware.js';

const router = express.Router();

router.post('/', expertAuthMiddleware, createCohort);
router.get('/', getCohorts);
router.get('/:id', getCohortById);
router.post('/:cohortId/feedback', authMiddleware, addFeedback);
router.get('/:cohortId/feedback', getCohortFeedback);

export default router;