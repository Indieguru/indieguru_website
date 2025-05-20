import express from "express";
import userRouter from "./userRoutes.js";
import expertRouter from "./expertRoutes.js";
import sessionRouter from "./sessionRoutes.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/expert", expertRouter);   
router.use("/session", sessionRouter);

export default router;