import User from "../../models/User.js";
import { errorHandler } from "../utils/error.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { ObjectId } from "mongodb";
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

export const getUserdata=async (req, res) => {
  console.log("request .body at get user data",req.body)
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
      }
    
      try {
        const user = await User.findById(req.body.userId).select('-password'); // Exclude the password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
