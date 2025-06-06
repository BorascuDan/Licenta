import { Router } from "express";
import { registerUsers, loginUser, deleteUser} from "../utils/middleware/login.mjs";
import { authenticateToken} from "../utils/utilFunction.mjs";

const router = Router()

router.post("/register", registerUsers);
router.post("/login", loginUser);
router.post("/delete", authenticateToken, deleteUser);

export default router;