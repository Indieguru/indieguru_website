import express from "express";
import userRouter from "./userRoutes.js";
import expertRouter from "./expertRoutes.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/expert", expertRouter);   


export default router;