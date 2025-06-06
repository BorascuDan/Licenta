import dotenv from "dotenv"
import db from "../database.mjs";
import { sendJsonResponse } from "../utilFunction.mjs";

dotenv.config()

export const health = async (req, res) => {
    try {
        let dbConnection;
        try {
            await db.raw('SELECT 1+1 AS result');
            dbConnection = "OK";
        } catch (error) {
            console.log("ERROR: ", error)
            dbConnection = false;
        }

        const response = {
            status: 'UP',
            uptime: process.uptime(),
            timestamp: Date.now(),
            db_connection: dbConnection
        }

        sendJsonResponse(res, true, 200, "Service is up", response);
    } catch (error) {
        console.error("delete error:", error);
        sendJsonResponse(res, false, 500, "Server error", null);
    }
};