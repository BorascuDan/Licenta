import db from "../database.mjs";
import {
    sendJsonResponse,
    shufle
} from "../utilFunction.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getRandomVideos = async (req, res) => {

    const { limit = 20 } = req.body ?? {}

    try {

        const videos = await db('videos');
        shufle(videos);
        const result = videos.slice(0,limit);

        return sendJsonResponse(res, true, 200, "Succesfully retrived videos", result);
    } catch (error) {
        console.error(`Couldn't get videos. \n Error${error}`);
        return sendJsonResponse(res, false, 500, "Couldn't get videos", null);
    }
}