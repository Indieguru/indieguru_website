import express from 'express';
import { bookSession, getSessionFeedback } from '../controllers/sessionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:sessionId/book', authMiddleware, bookSession);
router.get('/feedback', getSessionFeedback); // Public route to get testimonials

export default router;