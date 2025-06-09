import { Router } from "express";
import { authenticateToken} from "../utils/utilFunction.mjs";
import { backroundPicture, profile, profilePicture } from "../utils/middleware/profile.mjs";
import upload from "../utils/multer.mjs"

const router = Router()

router.get("/",authenticateToken ,profile);
router.put("/pic", authenticateToken, upload.single('profile_pic'), profilePicture);
router.put("/background", authenticateToken, upload.single('background_pic'), backroundPicture);

export default router;