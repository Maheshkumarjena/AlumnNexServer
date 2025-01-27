import User from "../../models/User.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const sourceRoute = req.headers['x-source-is-type'];
    console.log('Request received from:', sourceRoute);

    let username, email, password, dob, almaMater, lastYearOfEducation, hashedpassword, newUser;

    try {
        // Extract data and hash password
        if (sourceRoute === 'Student') {
            ({ username, email, password, dob } = req.body);
            hashedpassword = bcryptjs.hashSync(password, 10);
            newUser = new User({ username, email, password: hashedpassword, dob ,accountType:sourceRoute });
        } else if (sourceRoute === 'Alumni') {
            ({ username, email, password, dob, almaMater, lastYearOfEducation } = req.body);
            hashedpassword = bcryptjs.hashSync(password, 10);
            newUser = new User({ username, email, password: hashedpassword, dob, almaMater, lastYearOfEducation , accountType:sourceRoute });
        } else {
            return res.status(400).json({ error: 'Invalid source route provided.' });
        }

        // Save the new user
        await newUser.save();
        res.status(201).json({ message: 'User successfully registered!' });
        console.log("user successfully registered")
    } catch (error) {
        // Pass the error to the error-handling middleware
        next(error);
        console.log("user not registered")
    }

    console.log(req.body);
};