import jwt from 'jsonwebtoken';
// Update the import path for User
import User from '../models/User.js'; // Ensure the file extension is correct (e.g., .js)

const generateToken = (user) => {
  return jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
    const refreshToken = req.cookies?.refreshToken;

    if (!token && !refreshToken) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (refreshToken) {
            try {
                const { refreshToken } = req.cookies;
                  if (!refreshToken) {
                    return res.status(401).json({ message: 'Refresh token not provided.' });
                  }
                
                  try {
                    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
                    const user = await User.findById(decoded.id);
                    if (!user || user.refreshToken !== refreshToken) {
                      return res.status(403).json({ message: 'Invalid refresh token.' });
                    }
                
                    const newToken = generateToken(user._id);
                    const newRefreshToken = generateRefreshToken(user._id);
                    user.refreshToken = newRefreshToken;
                    await user.save();
                
                    res.cookie('token', newToken, { httpOnly: true, secure: true });
                    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
                    next()
                  } catch (err) {
                    res.status(403).json({ message: 'Invalid refresh token.' });
                  }
                next();
            } catch (refreshErr) {
                return res.status(403).json({ message: 'Invalid refresh token.' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid token.' });
        }
    }
};

export default authMiddleware;


