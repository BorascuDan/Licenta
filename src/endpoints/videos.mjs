import { Router } from "express";
import { authenticateToken} from "../utils/utilFunction.mjs";
import {getRandomVideos, getVideoDetails } from "../utils/middleware/videos.mjs"
import { sendJsonResponse } from "../utils/utilFunction.mjs";
const router = Router();
// `authenticateToken,`
router.get("/",  getRandomVideos, (req, res) => {
    return sendJsonResponse(
        res,
        true,
        200,
        "Successfully retrieved videos",
        res.locals.randomVideos
    );
});

router.get("/:id", authenticateToken, getRandomVideos, getVideoDetails, (req, res) => {
    const responseData = {
        videoDetails: res.locals.videoDetails,
        randomVideos: res.locals.randomVideos
    };
    
    return sendJsonResponse(
        res,
        true,
        200,
        "Successfully retrieved video details and random videos",
        responseData
    );
});

export default router;