// server.js

require('dotenv').config(); // Load environment variables first
const express = require('express');
const app = express();

// Packages
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Connections
const { connectDB } = require('./config/database'); // MongoDB connection
const { cloudinaryConnect } = require('./config/cloudinary'); // Cloudinary connection

// Routes
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payments');
const courseRoutes = require('./routes/course');

// Middleware
app.use(express.json()); // parse JSON body
app.use(cookieParser());

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// File upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
}));

// Connect to MongoDB
connectDB(); // reads connection string from .env and connects

// Connect to Cloudinary
cloudinaryConnect();

// Mount routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/course', courseRoutes);

// Default route
app.get('/', (req, res) => {
    res.send(`<div style="text-align:center; font-family:sans-serif;">
        <h2>Backend Server is Running!</h2>
        <p>Everything is OK ✅</p>
    </div>`);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on PORT ${PORT}`);
});
