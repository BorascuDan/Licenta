import { Router } from "express";
import auth from "../endpoints/authentication.mjs"
import health from "../endpoints/health.mjs"

//import componenta from "./../endpoints/componenta";
const router = Router()

//router.use('/name/', componenta);
router.use("/auth/", auth);
router.use("/health", health)


export default router;