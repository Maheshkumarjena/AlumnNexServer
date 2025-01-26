import express from "express";
import User from "../../models/User.js";
import { test } from "../controllers/user.controller.js";

const router=express.Router();


router.get('/signup',test); 


export default router;