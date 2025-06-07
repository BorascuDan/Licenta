import db from "../database.mjs";
import {
    sendJsonResponse
} from "../utilFunction.mjs";

export const likes = async (req, res) => {
    const { video_id, like_status } = req.body ?? {};
    const user_id = req.user.id;
    console.log(user_id)
    try {
        const result = {
            user_id,
            video_id,
            like_status
        }
        await db('likes')
            .insert(result)
            .onConflict(['user_id', 'video_id']).merge({ like_status });

        sendJsonResponse(res, true, 200, 'Like status updated', null);
    } catch (error) {
        sendJsonResponse(res, false, 500, error.message, null);
    }
}

export const myLikes = async (req, res) => {
    const user_id = req.user.id;
    try {
        const likes = await db('likes')
            .where({ user_id, like_status: 1 })
            .orderBy('upload_date', 'desc')
            .limit(10)
            .select('video_id');
        const videoIds = likes.map(l => l.video_id);
        if (videoIds.length === 0) {
            return sendJsonResponse(res, true, 200, 'No liked videos', []);
        }
        const videos = await db('videos').whereIn('id', videoIds);
        const orderedVideos = videoIds.map(id => videos.find(v => v.id === id));
        sendJsonResponse(res, true, 200, 'Liked videos retrieved', orderedVideos);
    } catch (error) {
        sendJsonResponse(res, false, 500, error.message, null);
    }
}