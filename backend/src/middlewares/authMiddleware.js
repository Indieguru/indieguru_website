import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
    const refreshToken = req.cookies?.refreshToken;
    console.log("authMiddleware", token, refreshToken);

    if (!token && !refreshToken) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        return next();
    } catch (err) {
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const user = await User.findById(decoded.id);
                if (!user || user.refreshToken !== refreshToken) {
                    return res.status(403).json({ message: 'Invalid refresh token.' });
                }

                const newToken = generateToken(user._id);
                const newRefreshToken = generateRefreshToken(user._id);
                user.refreshToken = newRefreshToken;
                await user.save();

                res.cookie('token', newToken, { httpOnly: true, secure: true, sameSite: "none" });
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true , sameSite: "none" });
                req.user = { id: user._id, userType: user.userType };
                return next();
            } catch (err) {
                return res.status(403).json({ message: 'Invalid refresh token.' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid token.' });
        }
    }
};

export default authMiddleware;


