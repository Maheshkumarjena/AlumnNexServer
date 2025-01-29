import express from "express";
import User from "../../models/User.js";
import {getProfile} from "../controllers/user.controller.js";

const router=express.Router();


router.get('/getProfile',getProfile); 


export default router;