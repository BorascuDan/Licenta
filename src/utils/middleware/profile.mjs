import db from "../database.mjs";
import {
    sendJsonResponse,
    shufle
} from "../utilFunction.mjs";

export const profile = async (req, res) => {
    const user_id = req.user.id;
    
    try {
        const user = await db('users')
            .where({ id: user_id })
            .select('id', 'username', 'email', 'profile_pic_url', 'backround_pic_url');
        
        if (!user) {
            return sendJsonResponse(res, false, 404, 'User not found', null);
        }

        const videos = await db('videos')
        .where({user_id});

        // Shuffle the videos array
        shufle(videos);

        // Get the requested number of videos
        const result = videos

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

        const data = {
            userDetail: user,
            userVideos: finalResult
        }
       
        sendJsonResponse(res, true, 200, 'Profile retrieved', data);
    } catch (error) {
        sendJsonResponse(res, false, 500, error.message, null);
    }
}

export const profilePicture = async (req, res) => {
    const user_id = req.user.id;
    const profilePicUrl = `/uploads/profile_pics/${req.file.filename}`;

    try {

        await db('users')
            .where({ id:user_id })
            .update({ profile_pic_url: profilePicUrl });

        sendJsonResponse(res, true, 200, 'Profile picture updated', null);
    } catch (error){
        sendJsonResponse(res, false, 500, error.message, null);
    }
}

export const backroundPicture = async (req, res) => {
    const user_id = req.user.id;
    const backgroundPicUrl = `/uploads/background_pics/${req.file.filename}`;

    try {
        
        await db('users')
            .where({ id:user_id })
            .update({ backround_pic_url: backgroundPicUrl });

        sendJsonResponse(res, true, 200, 'Background picture updated', null);
    } catch (error){
        sendJsonResponse(res, false, 500, error.message, null);
    }
}