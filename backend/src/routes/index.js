import express from "express";
import userRouter from "./userRoutes.js";
import expertRouter from "./expertRoutes.js";
import sessionRouter from "./sessionRoutes.js";
import courseRouter from "./courseRoutes.js";
import cohortRouter from "./cohortRoutes.js";
import adminRouter from "./adminRoutes.js";
import blogRouter from "./blogRoutes.js";
import communityRouter from "./communityRoutes.js";
import userAuthRouter from "./userAuthRoutes.js";
import expertAuthRouter from "./expertAuthRoutes.js";
import paymentRoutes from "./paymentRoutes.js"
import assessmentRouter from "./assessmentRoutes.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/user/auth", userAuthRouter);  // Add user auth routes
router.use("/expert", expertRouter);   
router.use("/expert/auth", expertAuthRouter);  // Add expert auth routes
router.use("/session", sessionRouter);
router.use("/course", courseRouter);
router.use("/cohort", cohortRouter);
router.use("/admin", adminRouter);
router.use("/blog", blogRouter);
router.use("/community", communityRouter);
router.use("/payment", paymentRoutes);
router.use("/assessment", assessmentRouter);  // Add assessment routes

export default router;