import db from "../database.mjs";
import {
    sendJsonResponse,
    shufle
} from "../utilFunction.mjs";

export const getRandomVideos = async (req, res, next) => {
    const { limit = 3 } = req.body ?? {};
    const user_id = req.user.id;
    try {
        // Fetch all videos from database
        const videos = await db('videos');

        // Shuffle the videos array
        // shufle(videos);

        // Get the requested number of videos
        const result = videos.slice(0, limit);

        const videoIds = result.map(v => v.id);
        
        const likeCounts = await db('likes')
            .whereIn('video_id', videoIds)
            .select(
                'video_id',
                db.raw('SUM(CASE WHEN like_status = 1 THEN 1 ELSE 0 END) as likes'),
                db.raw('SUM(CASE WHEN like_status = -1 THEN 1 ELSE 0 END) as dislikes')
            )
            .groupBy('video_id');


        const likeMap = likeCounts.reduce((acc, row) => {
            acc[row.video_id] = {
                likes: parseInt(row.likes, 10) || 0,
                dislikes: parseInt(row.dislikes, 10) || 0,
            };
            return acc;
        }, {});

        // 7. Attach likes/dislikes to each video in result
        const finalResult = result.map(video => ({
            ...video,
            likes: likeMap[video.id]?.likes || 0,
            dislikes: likeMap[video.id]?.dislikes || 0,
        }));
        // Store result in res.locals for next middleware
        res.locals.randomVideos = finalResult;

        // Continue to next middleware
        next();
    } catch (error) {
        console.error(`Couldn't get videos. \n Error: ${error}`);
        return sendJsonResponse(res, false, 500, "Couldn't get videos", null);
    }
};

export const myRecomendedVideos = async (req, res, next) => {
    const { limit = 10 } = req.body ?? {};
    const user_id = req.user.id;
    try {
        const likes = await db('likes')
            .where({ user_id, like_status: 1 })
            .orderBy('upload_date', 'desc')
            .limit(limit)
            .select('video_id');
            
        const videoIds = likes.map(l => l.video_id);
        
        if (videoIds.length === 0) {
            res.locals.randomVideos = [];  // store empty array if no liked videos
            return next();
        }
       // add ml call
        const videos = await db('videos').whereIn('id', videoIds);
        

        const likeCounts = await db('likes')
            .whereIn('video_id', videoIds)
            .select(
                'video_id',
                db.raw('SUM(CASE WHEN like_status = 1 THEN 1 ELSE 0 END) as likes'),
                db.raw('SUM(CASE WHEN like_status = -1 THEN 1 ELSE 0 END) as dislikes')
            )
            .groupBy('video_id');

        const likeMap = likeCounts.reduce((acc, row) => {
            acc[row.video_id] = {
                likes: parseInt(row.likes, 10) || 0,
                dislikes: parseInt(row.dislikes, 10) || 0,
            };
            return acc;
        }, {});

        const orderedVideos = videoIds.map(id => {
            const video = videos.find(v => v.id === id);
            return {
                ...video,
                likes: likeMap[id]?.likes || 0,
                dislikes: likeMap[id]?.dislikes || 0,
            };
        });

        // Store result in res.locals for later middleware/route to use
        res.locals.randomVideos = orderedVideos;

        // Proceed to next middleware
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

            const comments = await db('comments as com')
            .where({ 'com.video_id': videoId })
            .leftJoin('users as use', 'com.user_id', 'use.id')
            .select(
                'use.id as user_id',
                'use.username',
                'use.profile_pic_url',
                'com.comment',
                'com.upload_date'
            );
        
        // Prepare the result object
        const result = {
            video,
            likes: likeCounts?.likes || 0,
            dislikes: likeCounts?.dislikes || 0,
            userLikeStatus: userLike?.like_status || 0,
            comments
        };

        // Store result and continue to next middleware
        res.locals.videoDetails = result;
        next();

    } catch (error) {
        console.error(`Couldn't get video. \n Error: ${error}`);
        return sendJsonResponse(res, false, 500, "Couldn't get video", null);
    }
};

export const uploadVideo = async (req, res) => {
    const { title, description = '' } = req.body ?? {};

    const thumbnailUrl = `/thumbnails/${req.files['thumbnail'][0].filename}`;
    const videoUrl = `/videos/${req.files['video'][0].filename}`;
    const uploaderId = req.user.id;
    console.log(uploaderId)
    try {

        const result = {
            title,
            description,
            user_id: uploaderId,
            thumbnail_url: thumbnailUrl,
            video_url: videoUrl
        }

        await db('videos')
            .insert(result);

        sendJsonResponse(res, true, 201, 'Video uploaded', title);

    } catch (error) {
        console.error(`Couldn't upload video. \n Error: ${error}`);
        return sendJsonResponse(res, false, 500, "Couldn't upload video", null);
    }
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params ?? {};
    const userId = req.user.id;

    try {
        const title = await db('videos')
            .where({ id: id })
            .select('title');

        const deleted = await db('videos')
            .where({ id: id, user_id: userId })
            .del();

        if (!deleted) {
            return sendJsonResponse(res, false, 403, 'Not authorized or video not found', null);
        }

        sendJsonResponse(res, true, 200, 'Video deleted', title);
    } catch (error) {
        console.error(`Couldn't delete video. \n Error: ${error}`);
        return sendJsonResponse(res, false, 500, "Couldn't delete video", null);
    }
}