import express from 'express';
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    getExpertBlogs,
    updateBlog,
    deleteBlog,
    getBlogsByCategory,
    approveBlog,
    rejectBlog,
    getPendingBlogs
} from '../controllers/blogController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import expertAuthMiddleware from '../middlewares/expertAuthMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/category/:category', getBlogsByCategory);
router.get('/:id', getBlogById);

// Expert only routes
router.use('/expert', expertAuthMiddleware);
router.post('/expert/create', upload.blog, createBlog);
router.get('/expert/blogs', getExpertBlogs);
router.patch('/expert/:id', upload.blog, updateBlog);
router.delete('/expert/:id', deleteBlog);

// Admin only routes
router.use('/admin', adminAuthMiddleware);
router.get('/admin/pending', getPendingBlogs);
router.post('/admin/:id/approve', approveBlog);
router.post('/admin/:id/reject', rejectBlog);

export default router;