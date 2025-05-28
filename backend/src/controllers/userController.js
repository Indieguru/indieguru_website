import User from '../models/User.js';
import Course from '../models/Course.js';
import Cohort from '../models/Cohort.js';
import Session from '../models/Session.js';

export const getUserBookings = (type) => async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let items = [];
        switch (type) {
            case 'courses':
                items = await Course.find({ 
                    _id: { $in: user.purchasedCourses || [] },
                    activityStatus: 'live'
                });
                break;
            case 'cohorts':
                items = await Cohort.find({ 
                    _id: { $in: user.purchasedCohorts || [] }
                });
                break;
            case 'sessions':
                items = await Session.find({ 
                    bookedBy: userId,
                    bookedStatus: true
                })
                .populate('expert', 'firstName lastName title expertise')
                .sort({ date: 1, startTime: 1 });
                break;
            default:
                return res.status(400).json({ message: 'Invalid booking type' });
        }

        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};