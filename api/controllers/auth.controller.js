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
    console.log("data from frontend:", req.body);

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
        console.log('Environment:', process.env.NODE_ENV);

        res.cookie('token', token, {
            httpOnly: true, // Prevent client-side access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'Strict', // Prevent CSRF attacks
            maxAge: 3600000, // 1 hour in milliseconds
        }).status(200).json({
            message: 'Sign In successful',
            user: {
                id: existingUser._id,
                email: existingUser.email,
                username: existingUser.username,
                userType: existingUser.accountType,
                dob: existingUser.dob,
                almaMater: existingUser.almaMater
            }
        });
        // Respond with the token and user details

    } catch (error) {
        // Pass the error to the error-handling middleware
        next(error);
    }
};

export const authenticate = (req, res, next) => {
    console.log(req.body)
    const token = req.cookies.token; // Get token from cookies
    console.log('inside authenticate')
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
        console.log('token authorized')
    } catch (error) {
        res.status(403).json({ message: 'Unauthorized: Invalid token' });
        console.log('token not authorized')

    }
};

export const google = async (req, res, next) => {
    console.log("google login data", req.body);
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { password: hashedPassword, ...rest } = user.toObject();
            const expiresIn = Date.now() + 3600000;
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 3600000,
            }).status(200).json({ message: 'Sign In successful', user: rest, expiresIn });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
                accountType: req.body.accountType,
                profilePicture: req.body.photoURL,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { username, email, accountType, profilePicture } = newUser.toObject();
            const expiresIn = Date.now() + 3600000;
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 3600000,
            }).status(200).json({ message: 'Sign In successful', user: { username, email, accountType, profilePicture }, expiresIn });
        }
    } catch (error) {
        next(error);
        console.log("backend error");
    }
};
