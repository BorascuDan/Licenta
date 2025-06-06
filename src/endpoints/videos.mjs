import { Router } from "express";
import { authenticateToken} from "../utils/utilFunction.mjs";
import {deleteVideo, getRandomVideos, getVideoDetails, uploadVideo } from "../utils/middleware/videos.mjs"
import { sendJsonResponse } from "../utils/utilFunction.mjs";
import upload from "../utils/multer.mjs"

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

router.post("/uplad", authenticateToken, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]) , uploadVideo);

router.delete("/delete/:id", authenticateToken, deleteVideo);

export default router;