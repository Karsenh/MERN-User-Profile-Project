const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
    check,
    validationResult
} = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { response } = require('express');


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
    // Check for body errors
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
        if(website) profileFields.website = website
        if(location) profileFields.location = location
        if(bio) profileFields.bio = bio
        if(status) profileFields.status = status
        if(githubusername) profileFields.githubusername = githubusername
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Build social object
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            // Search for a user profile by id
            let profile = await Profile.findOne({ user: req.user.id });

            // If there is a profile...
             if (profile) {
                //  Update it
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true});
                return res.json(profile);
             }

            //  If there is NOT a profile...
            //  Create one
            profile = new Profile(profileFields);

            // Save the profile to database
            await profile.save();

            // Return profile json
            res.json(profile);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error!');
        }
    }
);

/**
 * @ROUTE   GET (API/Profile)
 * @desc    Get all profiles
 * @access  Public
 * 
 */
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');    
    }
});

/**
 * @ROUTE   GET (API/profile/user/:user_id)
 * @desc    Get profile by user ID
 * @access  Public
 * 
 */
router.get('/user/:user_id', async (req, res) => {
    try {
        // Search for a user profile by user_id
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        // If user profile doesn't exist send 400 error...
        if(!profile) return res.status(400).json({ msg: 'Profile not found' });

        // Else return the profile
        res.json(profile);
    } catch (err) {
        // Else if there is no valid object user id or otherwise...
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server error!');    
    }
});


module.exports = router;