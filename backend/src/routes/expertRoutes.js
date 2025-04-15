import expertAuthRoutes from "./expertAuthRoutes.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js"; // Ensure this middleware exists
import Expert from "../models/Expert.js"; // Ensure this model exists and is properly defined

const router = express.Router();

router.use("/auth", expertAuthRoutes);

router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { filter } = req.query; // Extract the filter string from query params

    // If filter is not provided or is an empty string, return all experts
    // if (!filter || filter.trim() === "") {
    //   const experts = await Expert.find();
    //   return res.status(200).json({ success: true, data: experts });
    // }

    // Build a query to check if the fields contain the filter string
    const query = {
      $or: [
        { domain: { $regex: `.*${filter}.*`, $options: "i" } }, // Case-insensitive match
        { name: { $regex: `.*${filter}.*`, $options: "i" } },
        { description: { $regex: `.*${filter}.*`, $options: "i" } },
      ],
    };

    // Fetch experts matching the query
    const experts = await Expert.find(query);

    res.status(200).json({ success: true, data: experts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});
//

export default router;