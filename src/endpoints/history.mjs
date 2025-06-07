import { Router } from "express";
import { authenticateToken} from "../utils/utilFunction.mjs";
import { history, myHistory } from "../utils/middleware/history.mjs";


const router = Router()

router.post("/",authenticateToken ,history);
router.get("/me", authenticateToken, myHistory);

export default router;