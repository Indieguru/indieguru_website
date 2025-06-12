import express from 'express';
import { bookSession, getSessionFeedback, getPastSessions, updateSessionFeedback, addNotesAndComplete, cancelSession, requestRefund } from '../controllers/sessionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import expertAuthMiddleware from '../middlewares/expertAuthMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/feedback', getSessionFeedback);

// Protected routes
router.post('/:sessionId/book', authMiddleware, bookSession);
router.post('/:sessionId/feedback', authMiddleware, updateSessionFeedback);
router.get('/past', authMiddleware, getPastSessions);
router.post('/:sessionId/refund-request', 
    authMiddleware, 
    upload.array('files', 5), 
    requestRefund
);

// Expert routes
router.post('/:sessionId/complete', 
    expertAuthMiddleware,
    upload.array('files', 5), // Using the enhanced session upload middleware
    addNotesAndComplete
);
router.post('/:sessionId/cancel', expertAuthMiddleware, cancelSession);

export default router;