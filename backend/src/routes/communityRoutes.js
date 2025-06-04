import express from 'express';
import { 
    createPost,
    getPosts,
    getPostsByCategory,
    deletePost,
    getUserPosts
} from '../controllers/communityController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import expertAuthMiddleware from '../middlewares/expertAuthMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/category/:category', getPostsByCategory);

// Helper middleware to handle authentication based on user type
const communityAuth = async (req, res, next) => {
    try {
        const userType = req.headers['x-user-type']; // Get user type from headers
        
        if (!userType) {
            return res.status(401).json({ message: 'User type not provided' });
        }

        if (userType === 'student') {
            await authMiddleware(req, res, () => {
                req.user.role = 'student';
                next();
            });
        } else if (userType === 'expert') {
            await expertAuthMiddleware(req, res, () => {
                req.user.role = 'expert';
                next();
            });
        } else {
            return res.status(401).json({ message: 'Invalid user type' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Authentication error', error: error.message });
    }
};

// Protected routes
router.get('/user/posts', communityAuth, getUserPosts);
router.post('/create', communityAuth, upload.array('images', 3), createPost);
router.delete('/:postId', communityAuth, deletePost);

export default router;