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
    const { limit = 10 } = req.body ?? {};
    const user_id = req.user.id;

    try {
        // Step 1: Fetch watch history
        const history = await db('watch_history')
            .where({ user_id })
            .orderBy('watched_at', 'desc')
            .limit(limit)
            .select('video_id', 'watched_at');

        if (history.length === 0) {
            return sendJsonResponse(res, true, 200, 'No watch history', []);
        }

        const videoIds = history.map(h => h.video_id);

        // Step 2: Fetch video details
        const videos = await db('videos').whereIn('id', videoIds);

        // Step 3: Fetch like/dislike counts
        const likeCounts = await db('likes')
            .whereIn('video_id', videoIds)
            .select(
                'video_id',
                db.raw('SUM(CASE WHEN like_status = 1 THEN 1 ELSE 0 END) as likes'),
                db.raw('SUM(CASE WHEN like_status = -1 THEN 1 ELSE 0 END) as dislikes')
            )
            .groupBy('video_id');

        // Step 4: Build a likeMap for quick lookup
        const likeMap = likeCounts.reduce((acc, row) => {
            acc[row.video_id] = {
                likes: parseInt(row.likes, 10) || 0,
                dislikes: parseInt(row.dislikes, 10) || 0,
            };
            return acc;
        }, {});

        // Step 5: Preserve the watch order and attach like/dislike + watched_at info
        const orderedVideos = history.map(h => {
            const video = videos.find(v => v.id === h.video_id);
            return {
                ...video,
                watched_at: h.watched_at,
                likes: likeMap[h.video_id]?.likes || 0,
                dislikes: likeMap[h.video_id]?.dislikes || 0,
            };
        });

        // Final response
        sendJsonResponse(res, true, 200, 'Watch history retrieved', orderedVideos);
    } catch (error) {
        console.error(error);
        sendJsonResponse(res, false, 500, 'Server error');
    }

}