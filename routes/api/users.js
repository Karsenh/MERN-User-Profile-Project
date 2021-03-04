const express = require('express');
const router = express.Router();
// Bring in gravatar package
const gravatar = require('gravatar');
// Bring in bcrypt to encrypt user passwords
const bcrypt = require('bcryptjs');
// Bring in JSON Web Token (JWT)
const jwt = require('jsonwebtoken');
// Require config for jwt secret
const config = require('config');
// Add express validtor to 'check' certain conditions
const {
    check,
    validationResult
} = require('express-validator');

// Bring in our user model
const User = require('../../models/User');

/**
 * @ROUTE   POST (API/Users)
 * @desc    Register user
 * @access  Public
 * 
 */
router.post('/', [
        // Validate that name is not empty using express validator
        check('name', 'Name is required').not().isEmpty(),
        // Validate that email is in correct email format using express validator
        check('email', 'Please include a valid email').isEmail(),
        // Validate that password contains at least 6 characters
        check('password', 'Please enter a password with 6 or more characters').isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        // If there is a Bad Request - return an object containing an errors: array {msg, param, location}
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        // Destructure req.body (name, email, password)
        const {
            name,
            email,
            password
        } = req.body;

        try {
            // See if a user with the email already exists
            let user = await User.findOne({
                email
            });

            // If a user with that email was found - user already exists - Bad Request
            if (user) {
                // Send a message that the user already exists
                return res.status(400).json({
                    errors: [{
                        msg: 'User already exists!'
                    }]
                });
            }

            // Get users gravatar
            const avatar = gravatar.url(email, {
                // default avatar size
                s: '200',
                // rating
                r: 'pg',
                // default image
                d: 'mm'
            })

            // Create an instance of a user (still need to call save() after encrypting pass)
            user = new User({
                name,
                email,
                avatar,
                password
            });

            // Encrypt password (using bcrypt)
            // First create a salt

            // Get a promise from bcrypt.gensalt passing in the number of rounds to salt (10 is current standard)
            const salt = await bcrypt.genSalt(10);

            // Hash password now using the password and the salt to the user.password
            user.password = await bcrypt.hash(password, salt);

            // Save the user which returns a promise (use await in front of anything that returns a promise)
            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error!');
        }



    });



module.exports = router;