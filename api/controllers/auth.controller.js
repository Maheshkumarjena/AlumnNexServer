import User from "../../models/User.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup =async (req,res,next)=>{
    const {username,email,password} = req.body;
    const hashedpassword=bcryptjs.hashSync(password,10);
    try {
    const newUser=User({username,email,password:hashedpassword});
    await newUser.save();
    res.status(201).json({message:"Signup route works!"});
    } catch (error) {
        // this pass the error to the error handeling middleware
        next(error);
    }
    
    console.log(req.body);
    console.log("data received from frontend")
}