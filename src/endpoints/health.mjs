import { Router } from "express";
import { health } from "../utils/middleware/health.mjs";

const router = Router()

router.get("/", health);

export default router;