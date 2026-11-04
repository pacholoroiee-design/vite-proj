const dns = require('node:dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const studentRoutes = require('./routes/students.cjs');
const authRoutes = require('./routes/auth.cjs');

const app = express();

// Allow requests from the React frontend
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

// API routes
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

// Connect MongoDB before starting the server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
