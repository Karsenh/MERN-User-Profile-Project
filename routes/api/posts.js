const express = require('express');
const router = express.Router();

/**
 * @ROUTE   GET (API/Posts)
 * @desc    Test route
 * @access  Public
 * 
 */
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;