import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Expert from '../models/Expert.js';
// Check for environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.JWT_SECRET) {
  console.error('Error: Google client ID, secret, and JWT secret must be provided.');
  process.exit(1);
}

const generateToken = (user) => {
  return jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
let callbackURL = '/api/v1/user/auth/google/callback'; // Use relative path

passport.use('google-user', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL, // Use relative path
  passReqToCallback: true // This allows us to access the query parameters
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const role = req.query.role || 'student'; // Get role from query parameter
    const existingUser = await User.findOne({ gid: profile.id, authType: 'gmail' });

    if (existingUser) {
      existingUser.role = role; // Update role
      await existingUser.save();
      const token = generateToken(existingUser);
      const refreshToken = generateRefreshToken(existingUser);
      return done(null, { user: existingUser, token, refreshToken, role });
    }

    // Split the display name into firstName and lastName
    const [firstName, ...lastNameParts] = profile.displayName.split(" ");
    const lastName = lastNameParts.join(" ");

    const newUser = new User({
      firstName,
      lastName,
      email: profile.emails[0].value,
      gid: profile.id,
      authType: 'gmail',
      emailVerified: true,
      role: role
    });

    await newUser.save();
    const token = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    done(null, { user: newUser, token, refreshToken, role });
  } catch (error) {
    console.error('Error during Google user authentication:', error);
    done(error, false);
  }
}));

passport.use('google-expert', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/v1/expert/auth/google/callback', // Use relative path
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("refreshToken", refreshToken);
    const existingUser = await Expert.findOne({ gid: profile.id });
    if (existingUser) {
      const token = generateToken(existingUser);
      const localRefreshToken = generateRefreshToken(existingUser);
      return done(null, { user: existingUser, token, localRefreshToken, googleRefreshToken: refreshToken, accessToken: accessToken });
    }
    // Split the display name into firstName and lastName
    const [firstName, ...lastNameParts] = profile.displayName.split(" ");
    const lastName = lastNameParts.join(" ");

    const newUser = new Expert({
      firstName,
      lastName,
      email: profile.emails[0].value,
      gid: profile.id,
      authType: 'gmail',
      emailVerified: true,
      userType: 'expert',
      googleRefreshToken: refreshToken, // Store the Google refresh token
    });

    await newUser.save();
    const token = generateToken(newUser);
    const localRefreshToken = generateRefreshToken(newUser);
    done(null, { user: newUser, token, localRefreshToken , googleRefreshToken:  refreshToken, accessToken : accessToken });
  } catch (error) {
    console.error('Error during Google expert authentication:', error);
    done(error, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, { id: user._id, userType: user.userType }); // Include userType in the serialized data
});

passport.deserializeUser(async (data, done) => {
  try {
    const { id, userType } = data;
    const model = userType === 'expert' ? Expert : User; // Determine the model based on userType
    const user = await model.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Error during deserialization:', error);
    done(error, false);
  }
});

