import db from "../database.mjs";
import {
    sendJsonResponse,
    shufle
} from "../utilFunction.mjs";

export const comment = async (req, res) => {
    const { video_id, comment } = req.body ?? {};
    const user_id = req.user.id;

    try {
        const insert = { user_id, video_id, comment };

        await db('comments')
            .insert(insert)
            .onConflict(['user_id', 'video_id'])
            .merge(['comment']);

        sendJsonResponse(res, true, 200, 'Comment updated', null);
    } catch {
        sendJsonResponse(res, false, 500, error.message, null);
    }
}