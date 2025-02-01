
import jwt from "jsonwebtoken";


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
