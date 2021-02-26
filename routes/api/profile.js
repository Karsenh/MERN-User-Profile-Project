const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
    check,
    validationResult
} = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');


/**
 * @ROUTE   GET (API/Profile/Me)
 * @desc    Get current users profile
 * @access  Private
 * 
 */
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate(
            'user',
            ['name', 'avatar']
        );

        if (!profile) {
            return res.status(400).json({
                msg: 'There is no profile for this user'
            });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @ROUTE   POST (API/Profile)
 * @desc    Create or Update user profile
 * @access  Private
 * 
 */
router.post("/", auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is requried').not().isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // Build the Profile Object
        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company
    }
);

module.exports = router;