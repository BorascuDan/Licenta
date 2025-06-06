import db from "../database.mjs";
import {
    sendJsonResponse,
    shufle
} from "../utilFunction.mjs";

export const getRandomVideos = async (req, res, next) => {
    const { limit = 3 } = req.body ?? {};

    try {
        // Fetch all videos from database
        const videos = await db('videos');
        
        // Shuffle the videos array
        shufle(videos);
        
        // Get the requested number of videos
        const result = videos.slice(0, limit);

        // Store result in res.locals for next middleware
        res.locals.randomVideos = result;
        
        // Continue to next middleware
        next();
    } catch (error) {
        console.error(`Couldn't get videos. \n Error: ${error}`);
        return sendJsonResponse(res, false, 500, "Couldn't get videos", null);
    }
};

export const getVideoDetails = async (req, res, next) => {
    const videoId = req.params?.id;
    const userId = req.user?.id;

    if (!videoId) {
        return sendJsonResponse(res, false, 400, 'Video ID is required', null);
    }

    if (!userId) {
        return sendJsonResponse(res, false, 401, 'User authentication required', null);
    }

    try {
        // Find the video by ID
        const video = await db('videos')
            .where({ id: videoId })
            .first();

        if (!video) {
            return sendJsonResponse(res, false, 404, 'Video not found', null);
        }

        // Increment view count
        await db('videos')
            .where({ id: videoId })
            .increment('views', 1);

        // Get like and dislike counts
        const likeCounts = await db('likes')
            .where({ video_id: videoId })
            .select(
                db.raw('SUM(CASE WHEN like_status = 1 THEN 1 ELSE 0 END) as likes'),
                db.raw('SUM(CASE WHEN like_status = -1 THEN 1 ELSE 0 END) as dislikes')
            )
            .first();

        // Get current user's like status for this video
        const userLike = await db('likes')
            .where({ 
                user_id: userId, 
                video_id: videoId 
            })
            .select('like_status')
            .first();

        // Prepare the result object
        const result = {
            video,
            likes: likeCounts?.likes || 0,
            dislikes: likeCounts?.dislikes || 0,
            userLikeStatus: userLike?.like_status || 0,
        };

        // Store result and continue to next middleware
        res.locals.videoDetails = result;
        next();

    } catch (error) {
        console.error(`Couldn't get video. \n Error: ${error}`);
        return sendJsonResponse(res, false, 500, "Couldn't get video", null);
    }
};