import express from "express";
import userRouter from "./userRoutes.js";
import expertRouter from "./expertRoutes.js";
import sessionRouter from "./sessionRoutes.js";
import courseRouter from "./courseRoutes.js";
import cohortRouter from "./cohortRoutes.js";
import adminRouter from "./adminRoutes.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/expert", expertRouter);   
router.use("/session", sessionRouter);
router.use("/course", courseRouter);
router.use("/cohort", cohortRouter);
router.use("/admin", adminRouter);

export default router;