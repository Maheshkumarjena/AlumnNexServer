import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './api/routes/user.route.js';
import authRouter from './api/routes/auth.route.js';

dotenv.config({ path: './.env.local' });
// Initialize the Express application
const app = express();

app.use(express.json());


// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI ;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);


app.use((err, req, res, next) => {
    const statuscode = res.statusCode !== 200 ? res.statusCode : 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statuscode).send({
        success:false,
        error:message,
        statuscode,
    });
});