import { Router } from "express";
import users from "./../endpoints/users.mjs"

//import componenta from "./../endpoints/componenta";
const router = Router()

//router.use('/name/', componenta);
router.use('/users/', users);


export default router;