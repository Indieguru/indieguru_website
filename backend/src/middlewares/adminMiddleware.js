import jwt from 'jsonwebtoken';
import Expert from '../models/Expert.js';

const adminMiddleware = async (req, res, next) => {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ESECRET);
        const expert = await Expert.findById(decoded.id);
        
        if (!expert || !expert.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        req.user = {
            id: expert._id.toString(),
            isAdmin: true
        };
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export default adminMiddleware;