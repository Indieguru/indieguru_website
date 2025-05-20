import express from 'express';
import { bookSession, getSessionFeedback, getPastSessions, updateSessionFeedback } from '../controllers/sessionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:sessionId/book', authMiddleware, bookSession);
router.post('/:sessionId/feedback', authMiddleware, updateSessionFeedback);
router.get('/past', authMiddleware, getPastSessions);
router.get('/feedback', getSessionFeedback); // Public route to get testimonials

export default router;