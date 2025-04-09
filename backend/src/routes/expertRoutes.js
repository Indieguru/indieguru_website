import expertAuthRoutes from "./expertAuthRoutes.js";
import express from "express";

const router = express.Router();

router.use("/auth", expertAuthRoutes);

export default router;