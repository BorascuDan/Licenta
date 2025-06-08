import { Router } from "express";
import { authenticateToken} from "../utils/utilFunction.mjs";
import { comment } from "../utils/middleware/comments.mjs";

const router = Router()

router.post("/",authenticateToken, comment);

export default router;