import express from "express";
import User from "../../models/User.js";
import {getProfile} from "../controllers/user.controller.js";
import { getUserdata } from "../controllers/user.controller.js";
const router=express.Router();


router.get('/getProfile',getProfile); 
router.post('/getUserdata',getUserdata);


export default router;