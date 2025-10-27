import express from "express";
import "dotenv/config.js";
import connectDB from "./src/config/db.js"; // Corrected import path
import cors from "cors";
import rootRouter from "./src/routes/index.js";
import passport from 'passport';
import Expert from './src/models/Expert.js'; // Retain this import
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser"; // Added import for cookie-parser
import { errorMiddleware } from './src/middlewares/errorMiddleware.js'; // Fixed import to use named import

// Load environment variables

console.log(process.env.MONGO_URI);
connectDB(); 

const app = express();
app.use(cookieParser()); 


app.use(express.json());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: [
    process.env.TYPE === 'development' 
      ? `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`
      : process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://myindieguru.com/',
    'https://www.myindieguru.com/'
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/v1", rootRouter);

const experts = [
  {
    name: "Dr. Ananya Mehta",
    domain: "Psychology",
    description: "Clinical psychologist with over 10 years of experience in cognitive therapy.",
    email: "ananya.mehta@example.com",
    password: "hashed_password_123",
    emailOtp: null,
    emailVerified: true,
    authType: "email",
    gid: null
  },
  {
    name: "Rohit Sharma",
    domain: "Web Development",
    description: "Full-stack developer with a passion for teaching MERN stack.",
    email: "rohit.sharma@example.com",
    password: null,
    emailOtp: null,
    emailVerified: true,
    authType: "gmail",
    gid: "google-id-112233"
  },
  {
    name: "Sonal Kapoor",
    domain: "Marketing",
    description: "Digital marketer specializing in SEO and brand growth strategies.",
    email: "sonal.kapoor@example.com",
    password: "hashed_password_456",
    emailOtp: "721134",
    emailVerified: false,
    authType: "email",
    gid: null
  },
  {
    name: "Karan Verma",
    domain: "Finance",
    description: "Financial advisor with a focus on personal investment strategies.",
    email: "karan.verma@example.com",
    password: null,
    emailOtp: null,
    emailVerified: true,
    authType: "gmail",
    gid: "google-id-445566"
  },
  {
    name: "Priya Nair",
    domain: "UX Design",
    description: "UX/UI designer passionate about creating accessible user experiences.",
    email: "priya.nair@example.com",
    password: "hashed_password_789",
    emailOtp: "889922",
    emailVerified: false,
    authType: "email",
    gid: null
  }
];

// Insert experts into the database only if the collection is empty
const initializeExperts = async () => {
  const expertCount = await Expert.countDocuments();
  if (expertCount === 0) {
    await Expert.insertMany(experts);
    console.log("Experts added to the database.");
  } else {
    console.log("Experts already exist in the database.");
  }
};

initializeExperts(); // Call the function to initialize experts

// Added cookie-parser middleware

// Initialize Passport

// Set Content-Security-Policy headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data: https: 'unsafe-inline'; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;"
  );
  next();
});

// Add Google OAuth config endpoint
app.get('/api/v1/user/auth/google/env', (req, res) => {
  res.json({
    clientId: process.env.GOOGLE_CLIENT_ID,
    callbackUrl: process.env.TYPE === 'production' 
      ? `${process.env.BACKEND_URL}/api/v1/user/auth/google/callback`
      : `/api/v1/user/auth/google/callback`
  });
});

// Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000; // Use PORT from .env
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
