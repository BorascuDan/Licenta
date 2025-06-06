import { Router } from "express";
import { authenticateToken} from "../utils/utilFunction.mjs";
import {getRandomVideos } from "../utils/middleware/videos.mjs"

const router = Router();
// `authenticateToken,`
router.get("/",  getRandomVideos)

export default router;