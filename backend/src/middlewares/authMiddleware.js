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
    console.log("step 1 token", token);

    if (!token && !refreshToken) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    console.log("step 2 token", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("step 3 token", token);
        return next();
    } catch (err) {
        if (refreshToken) {
            console.log("step 4 token", token);
            try {
                const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const user = await User.findById(decoded.id);
                if (!user || user.refreshToken !== refreshToken) {
                    return res.status(403).json({ message: 'Invalid refresh token.' });
                }

                console.log("step 5 token", token);

                const newToken = generateToken(user._id);
                const newRefreshToken = generateRefreshToken(user._id);
                user.refreshToken = newRefreshToken;
                await user.save();

                res.cookie('token', newToken, { httpOnly: true, secure: true, sameSite: "none" });
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true , sameSite: "none" });
                req.user = { id: user._id, userType: user.userType };
                console.log("step 6 token", token);
                return next();
            } catch (err) {
                console.log("step 7 token", token);
                return res.status(403).json({ message: 'Invalid refresh token.' });
            }
        } else {
            console.log("step 8 token", token);
            return res.status(400).json({ message: 'Invalid token.' });
        }
    }
};

export default authMiddleware;


