import express from "express";
import "dotenv/config.js";
import connectDB from "./src/config/db.js"; // Corrected import path
import cors from "cors";
import rootRouter from "./src/routes/index.js";
import passport from 'passport';
import Expert from './src/models/Expert.js';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser"; // Added import for cookie-parser
// Load environment variables

console.log(process.env.MONGO_URI);
connectDB(); // Connect to MongoDB

const app = express();

// Configure CORS
// const corsOptions = {
//   origin: ['https://indie-guru-website-git-main-anukuljain42-gmailcoms-projects.vercel.app/','https://indie-guru-website-b33gkuob2-anukuljain42-gmailcoms-projects.vercel.app','https://indie-guru-website.vercel.app',`${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`,`${process.env.FRONTEND_URL}`] ,// Use FRONTEND_PORT from .env
//   // origin:"*",
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// };
// console.log(corsOptions.origin);
// // app.use(cors());
// app.use(cors(corsOptions));
const corsOptions = {
  origin: [
    `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`,
    `${process.env.FRONTEND_URL}`
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Added cookie-parser middleware

// Initialize Passport
app.use(passport.initialize());

// Set Content-Security-Policy headers
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' data:;");
  next();
});

app.use("/api/v1", rootRouter);

const PORT = process.env.PORT || 5000; // Use PORT from .env
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
