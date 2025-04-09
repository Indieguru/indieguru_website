import express from "express";
import "dotenv/config.js";
import connectDB from "./config/db.js"; // Corrected import path
import cors from "cors";
import rootRouter from "./routes/index.js";
import passport from 'passport';
import Expert from './models/Expert.js';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser"; // Added import for cookie-parser
// Load environment variables

console.log(process.env.MONGO_URI);
connectDB(); // Connect to MongoDB

const app = express();

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend's URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
