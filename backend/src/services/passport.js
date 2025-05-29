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
const generateToken2 = (user) => {
  return jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_ESECRET, { expiresIn: '1h' });
};

const generateRefreshToken2 = (user) => {
  return jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_EREFRESH_SECRET, { expiresIn: '7d' });
};
let backendUrl = (process.env.TYPE === 'production') ? process.env.BACKEND_URL : `${process.env.BACKEND_URL}:${process.env.PORT}`;
let callbackURL = '/api/v1/user/auth/google/callback'; // Use relative path
if(process.env.TYPE === 'production') 
  callbackURL = `${process.env.BACKEND_URL}/api/v1/user/auth/google/callback`; // Use absolute path for production

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
    
      const token = generateToken(existingUser);
      const refreshToken = generateRefreshToken(existingUser);
      existingUser.refreshToken = refreshToken; // Store the Google refresh token
      await existingUser.save();
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

    const token = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    newUser.refreshToken = refreshToken; // Store the Google refresh token
    await newUser.save();
    done(null, { user: newUser, token, refreshToken, role });
  } catch (error) {
    console.error('Error during Google user authentication:', error);
    done(error, false);
  }
}));

passport.use('google-expert', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${backendUrl}/api/v1/expert/auth/google/callback`, // Use relative path
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await Expert.findOne({ gid: profile.id });
    if (existingUser) {
      // console.log("new"+refreshToken);
      const token = generateToken2(existingUser);
      const refreshToken = generateRefreshToken2(existingUser);
      await Expert.updateOne( { _id: existingUser._id }, { $set: { refreshToken: refreshToken } }); // Store the Google refresh token
      return done(null, { user: existingUser, token, refreshToken});
    }
    
    // Split the display name into firstName and lastName
    const [firstName, ...lastNameParts] = profile.displayName.split(" ");
    const lastName = lastNameParts.join(" ");
    
    // Create new user first
    const newUser = new Expert({
      firstName,
      lastName,
      email: profile.emails[0].value,
      gid: profile.id,
      authType: 'gmail',
      emailVerified: true,
      userType: 'expert',
    });

    // Then generate tokens
    const token = generateToken2(newUser);
    const refreshToken = generateRefreshToken2(newUser);
    newUser.refreshToken = refreshToken;

    await newUser.save();
    done(null, { user: newUser, token, refreshToken });
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

