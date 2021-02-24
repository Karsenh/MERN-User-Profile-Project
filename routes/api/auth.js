const express = require('express');
const router = express.Router();
// Bring in 'auth' to protect this route
const auth = require('../../middleware/auth');

// Bring in the user model
const User = require('../../models/User'); 

/**
 * @ROUTE   GET (API/auth)
 * @desc    Test route
 * @access  Public
 * 
 */
// Pass in 'auth' to protect the route with JWT
router.get('/', auth, async (req, res) => {
    try {
        // Find user by id by passing in the req.user.id, leaving off the password in the data
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

module.exports = router;