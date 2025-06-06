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