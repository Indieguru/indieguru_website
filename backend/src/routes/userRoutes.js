import userAuthRoutes from './userAuthRoutes.js';
import express from 'express';
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation
import User from '../models/User.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use('/auth', userAuthRoutes);

router.get('/details', authMiddleware, async (req, res) => {
    try {
        console.dir(req.user)
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            console.log('Invalid user ID format');
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const user = await User.findOne({ _id: req.user.id }).lean(); // Use .lean() to return a plain object
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'User does not exist' });
        }
        // console.log(user);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update', authMiddleware, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const user = await User.updateOne({ _id: req.user.id }, { ...req.body }).lean(); // Use .lean() to return a plain object
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'User does not exist' });
        }
        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/check-email/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(200).json({ message: 'Email available' });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;