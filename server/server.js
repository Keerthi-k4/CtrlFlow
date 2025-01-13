const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./Routes/userRoutes'); // Ensure this path is correct

const app = express();

// Middleware
const allowedOrigin = 'http://localhost:3000'; // Replace with your frontend URL

// Configure CORS
app.use(cors({
    origin: allowedOrigin,
    credentials: true // Allow credentials (like cookies) to be included in requests
}));app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {

}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
