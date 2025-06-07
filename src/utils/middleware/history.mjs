import db from "../database.mjs";
import {
    sendJsonResponse
} from "../utilFunction.mjs";

export const history = async (req, res) => {
    const { video_id } = req.body;
    const user_id = req.user.id;

    try {
        const result = {
            user_id,
            video_id,
            watched_at: db.fn.now()
        }

        await db('watch_history')
            .insert(result)
            .onConflict(['user_id', 'video_id'])
            .merge(['watched_at']);


        sendJsonResponse(res, true, 200, 'Watch history updated', null);
    } catch (error) {
        sendJsonResponse(res, false, 500, error.message, null);
    }
}

export const myHistory = async (req, res) => {
    const user_id = req.user.id;
    try {
        const history = await db('watch_history')
            .where({ user_id })
            .orderBy('watched_at', 'desc')
            .limit(3)
            .select('video_id');

        const videoIds = history.map(h => h.video_id);
        if (videoIds.length === 0) {
            return sendJsonResponse(res, true, 200, 'No watch history', []);
        }

        const videos = await db('videos').whereIn('id', videoIds);
        const orderedVideos = videoIds.map(id => videos.find(v => v.id === id));
        sendJsonResponse(res, true, 200, 'Watch history retrieved', orderedVideos);
    } catch (error) {
        sendJsonResponse(res, false, 500, error.message, null);
    }
}