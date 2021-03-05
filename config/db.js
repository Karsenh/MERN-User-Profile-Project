const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/**
 * @ROUTE   GET (API/Users)
 * @desc    Test route
 * @access  Public
 * 
 */
router.get('/', (req, res) => res.send('User route'));

module.exports = router;
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
        console.log('Successfully Connected to MongoDB!');
    } catch(err) {
        // If can't connect, show err...
        console.log(err.message);
        // Exit the process with failure code
        process.exit(1);
    }
}

module.exports = connectDB;