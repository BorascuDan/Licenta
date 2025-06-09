import { Router } from "express";
import { authenticateToken} from "../utils/utilFunction.mjs";
import { registerUsers, loginUser, deleteUser} from "../utils/middleware/login.mjs";


const router = Router()

router.post("/register", registerUsers);
router.post("/login", loginUser);
router.delete("/delete", authenticateToken, deleteUser);

export default router;