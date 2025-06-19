import { Router } from "express";
import { authenticateToken} from "../utils/utilFunction.mjs";
import { similarity } from "../utils/middleware/users.mjs";

const router = Router()

router.post("/",  authenticateToken ,similarity);

export default router;