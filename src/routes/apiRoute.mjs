import { Router } from "express";
import auth from "../endpoints/authentication.mjs"

//import componenta from "./../endpoints/componenta";
const router = Router()

//router.use('/name/', componenta);
router.use('/auth/', auth);


export default router;