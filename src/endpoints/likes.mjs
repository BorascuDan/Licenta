import { Router } from "express";
import { authenticateToken} from "../utils/utilFunction.mjs";
import { likes } from "../utils/middleware/likes.mjs";

const router = Router()

router.post("/",authenticateToken ,likes);

export default router;