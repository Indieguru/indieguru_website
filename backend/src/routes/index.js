import express from 'express';
import userAuthRoutes from './userAuthRoutes.js';
import userRoutes from './userRoutes.js';
import expertRoutes from './expertRoutes.js';
import blogRoutes from './blogRoutes.js';
import communityRoutes from './communityRoutes.js';
import sessionRoutes from './sessionRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';

const router = express.Router();

router.use('/auth', userAuthRoutes);
router.use('/users', userRoutes);
router.use('/experts', expertRoutes);
router.use('/blogs', blogRoutes);
router.use('/community', communityRoutes);
router.use('/sessions', sessionRoutes);
router.use('/assessment', assessmentRoutes);

export default router;