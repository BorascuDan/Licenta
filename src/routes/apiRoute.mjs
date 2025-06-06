import { Router } from "express";
import auth from "../endpoints/authentication.mjs"
import health from "../endpoints/health.mjs"
import video from "../endpoints/videos.mjs"
//import componenta from "./../endpoints/componenta";
const router = Router()

//router.use('/name/', componenta);
router.use("/auth/", auth);
router.use("/health", health)
router.use("/video/", video)


export default router;