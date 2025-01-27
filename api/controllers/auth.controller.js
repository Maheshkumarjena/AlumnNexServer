import User from "../../models/User.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const sourceRoute = req.headers['x-source-is-type'];
    console.log('Request received from:', sourceRoute);

    let username, email, password, dob, almaMater, lastYearOfEducation, hashedpassword, newUser;

    try {
        // Extract data and hash password
        if (sourceRoute === 'Student') {
            ({ username, email, password, dob } = req.body);
            hashedpassword = bcryptjs.hashSync(password, 10);
            newUser = new User({ username, email, password: hashedpassword, dob, accountType: sourceRoute });
        } else if (sourceRoute === 'Alumni') {
            ({ username, email, password, dob, almaMater, lastYearOfEducation } = req.body);
            hashedpassword = bcryptjs.hashSync(password, 10);
            newUser = new User({ username, email, password: hashedpassword, dob, almaMater, lastYearOfEducation, accountType: sourceRoute });
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

export const signin = async (req, res, next) => {

    const { email, password } = req.body;
    console.log("data form frontend ", req.body)

    try {
        // Check if the user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the password
        const isPasswordValid = bcryptjs.compareSync(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET, // Replace with your secret key
            { expiresIn: '1h' } // Token expiration time
        );

        res.cookie('token', token, {
            httpOnly: true, // Prevent client-side access to the cookie
            secure: process.env.JWT_SECRET === 'production', // Use secure cookies in production
            sameSite: 'Strict', // Prevent CSRF attacks
            maxAge: 3600000, // 1 hour in milliseconds
        }).status(200).json({ message: 'Sign In successful', user: { id: existingUser._id, email: existingUser.email, username: existingUser.username , userType:existingUser.accountType , dob:existingUser.dob , almaMater:existingUser.almaMater  } });
        // Respond with the token and user details

    } catch (error) {
        // Pass the error to the error-handling middleware
        next(error);
    }
};



const authenticate = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }
};