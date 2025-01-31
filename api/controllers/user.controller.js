import User from "../../models/User.js";
import { errorHandler } from "../utils/error.js";
import { authenticate } from "./auth.controller.js";

export const getProfile = [authenticate, async (req, res) => {
    console.log(req.cookies); 
    console.log("get profile");
    
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude the password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}];
