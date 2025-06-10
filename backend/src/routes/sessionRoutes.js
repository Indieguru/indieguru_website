import express from 'express';
import { bookSession, getSessionFeedback, getPastSessions, updateSessionFeedback, addNotesAndComplete } from '../controllers/sessionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import expertAuthMiddleware from '../middlewares/expertAuthMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/:sessionId/book', authMiddleware, bookSession);
router.post('/:sessionId/feedback', authMiddleware, updateSessionFeedback);
router.post('/:sessionId/complete', expertAuthMiddleware, upload.array('files'), addNotesAndComplete);
router.get('/past', authMiddleware, getPastSessions);
router.get('/feedback', getSessionFeedback); // Public route to get testimonials

export default router;