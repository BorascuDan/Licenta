import { Router } from "express";
import { authenticateToken} from "../utils/utilFunction.mjs";
import { likes, myLikes } from "../utils/middleware/likes.mjs";

const router = Router()

router.post("/",authenticateToken ,likes);
router.get("/me",authenticateToken ,myLikes);

export default router;