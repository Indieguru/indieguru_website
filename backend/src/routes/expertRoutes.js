import expertAuthRoutes from "./expertAuthRoutes.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js"; // Ensure this middleware exists
import Expert from "../models/Expert.js"; // Ensure this model exists and is properly defined
import { matchExperts } from '../controllers/expertController.js';

const router = express.Router();

router.use("/auth", expertAuthRoutes);


router.get('/match', authMiddleware, matchExperts);

router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { filter } = req.query; 

 
    const query = {
      $or: [
        { domain: { $regex: `.*${filter}.*`, $options: "i" } }, // Case-insensitive match
        { name: { $regex: `.*${filter}.*`, $options: "i" } },
        { description: { $regex: `.*${filter}.*`, $options: "i" } },
      ],
    };

  
    const experts = await Expert.find(query);

    res.status(200).json({ success: true, data: experts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});
//

router.post("/create-session", createSession);


export default router;