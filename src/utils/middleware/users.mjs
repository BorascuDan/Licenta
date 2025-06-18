import db from "../database.mjs";
import {
    sendJsonResponse,
    shufle
} from "../utilFunction.mjs";

export const similarity = async (req, res) => {
    const user_id = req.user?.id ?? 1;

    try {
        const userRecomanded = await db('users')
            .where({ id: user_id })
            .select('recommended_videos')
            .first();

        const otherUserRecomanded = await db('users')
            .where('id', '!=', user_id)
            .select('recommended_videos', 'id');

        const ids = new Set(userRecomanded.recommended_videos.replace(/"/g, '').split(',').map(Number));

        let otherIds = [];
        otherUserRecomanded.forEach(user => {
            if (user.recommended_videos !== null) {
                const userId = user.id;
                const videoId = new Set(user.recommended_videos.replace(/"/g, '').split(',').map(Number));
                let otherId = new Map();
                otherId.set(userId, videoId);
                otherIds.push(otherId);
            }
        }); 

        for (let map of otherIds) {
            let count = 0;
            for (let [key, value] of map) {
                for (let number of value) {
                    if (ids.has(number)) count++;
                }
                
                if (count >= ids.size/2){
                    let rezult = {
                        user_id,
                        similar_user_id: key
                    }

                    const id = await db('similars')
                        .insert(rezult)
                        .onConflict('user_id')
                        .merge();
                }
            }

        }


        


        sendJsonResponse(res, true, 200, 'userRecomandedProfile retrieved', null);
    } catch (error) {
        sendJsonResponse(res, false, 500, error.message, null);
    }
}
