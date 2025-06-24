import userAuthRoutes from './userAuthRoutes.js';
import express from 'express';
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation
import User from '../models/User.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { bookSession } from '../controllers/sessionController.js'; // Import the bookSlot function
import { sendOtp } from '../controllers/otpcontroller.js'; // Import the sendOtp function
import { getUserBookings } from '../controllers/userController.js'; // Import the getUserBookings function
import upload from '../middlewares/upload.js';
import { cloudinary } from '../config/cloudinary.js';
import multer from 'multer';
const router = express.Router();

router.use('/auth', userAuthRoutes);

// Profile picture upload route
router.post('/profile-picture', authMiddleware, (req, res, next) => {
    upload.single('image')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      } else if (err) {
        console.error('Unknown upload error:', err);
        return res.status(500).json({ message: 'Upload error', error: err.message });
      }
      next();
    });
  }, async (req, res) => {
  try {
    console.log('File upload request received');
    console.log('Request file:', req.file);
    
    if (!req.file) {
      console.log('No file received in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Cloudinary file path:', req.file.path);
    
    // Set the profile picture URL directly
    user.profilePicture = req.file.path;
    await user.save();
    
    console.log('Profile picture updated successfully');
    res.status(200).json({ 
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture // Return the string URL
    });
  } catch (error) {
    console.error('Detailed error updating profile picture:', {
      message: error.message,
      stack: error.stack,
      file: req.file,
      user: req.user
    });
    res.status(500).json({ message: 'Error updating profile picture', error: error.message });
  }
});

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

        // Check for duplicate phone number if phone is being updated
        if (req.body.phone) {
            const existingUserWithPhone = await User.findOne({ 
                phone: req.body.phone, 
                _id: { $ne: req.user.id } // Exclude current user
            });
            
            if (existingUserWithPhone) {
                return res.status(409).json({ 
                    message: 'This phone number is already associated with another account',
                    code: 11000 // Send MongoDB duplicate key error code for consistency
                });
            }
        }
        
        const user = await User.updateOne({ _id: req.user.id }, { ...req.body });
        
        if (user.matchedCount === 0) {
            console.log('User not found');
            return res.status(401).json({ message: 'User does not exist' });
        }
        
        console.log(user);
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user details:', error);
        
        // Handle MongoDB duplicate key error specifically
        if (error.code === 11000) {
            return res.status(409).json({ 
                message: 'This phone number is already associated with another account',
                code: 11000,
                keyValue: error.keyValue
            });
        }
        
        res.status(500).json({ message: 'Error updating user details', error: error.message });
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
router.post("/book-slot/:sessionId", bookSession);
router.get("/sendotp",sendOtp);

// Get user's booked items
router.get('/cohorts', authMiddleware, getUserBookings('cohorts'));
router.get('/courses', authMiddleware, getUserBookings('courses'));
router.get('/sessions', authMiddleware, getUserBookings('sessions'));

export default router;