import { Router } from "express";
import auth from "../endpoints/authentication.mjs"
import health from "../endpoints/health.mjs"
import video from "../endpoints/videos.mjs"
import likes from "../endpoints/likes.mjs";
import history from "../endpoints/history.mjs";
import profile from "../endpoints/profile.mjs";
import comments from "../endpoints/comments.mjs"
//import componenta from "./../endpoints/componenta";
const router = Router()

//router.use('/name/', componenta);
router.use("/auth/", auth);
router.use("/health", health);
router.use("/video/", video);
router.use("/likes/", likes);
router.use("/history/", history)
router.use("/profile/", profile)
router.use("/comments/", comments)


export default router;