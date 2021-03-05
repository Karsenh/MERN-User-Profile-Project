const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

// Bring in all models (for name / avatar / post)
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

/**
 * @ROUTE   POST (api/posts)
 * @desc    Create a post
 * @access  Private
 */
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        // save the new post in a variable ready to send as a response
        const post = await newPost.save();

        // Send that new post variable in a response
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @ROUTE   GET (api/posts)
 * @desc    Get all posts
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
    try {
        // Find posts and sort by most recent (-1)
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @ROUTE   GET (api/posts/:id)
 * @desc    Get post by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
    try {
        // Find post by id from url
        const post = await Post.findById(req.params.id);

        // Check to see if there is a post with that ID
        // if not...
        if(!post) {
            return res.status(404).json({ msg: 'Post not found!'});
        }
        res.json(post);
        
    } catch (err) {
        console.error(err.message);
        // If the object id in the url is not a formatted id - there will be no post found...
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found!'});
        }
        res.status(500).send('Server error');
    }
});

/**
 * @ROUTE   DELETE (api/posts/:id)
 * @desc    Delete a post by ID
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        // Find post
        const post = await Post.findById(req.params.id);

        // If post doesn't exist
        if(!post) {
            return res.status(404).json({ msg: 'Post not found!'});
        }

        // Ensure the user deleting the post is the user who created the post by matching the posting user to the req user
        if(post.user.toString() !== req.user.id) {
            // Return 'not authorized' status with message
            return res.status(401).json({ msg: 'User not authorized' });
        } 
        
        await post.remove();

        res.json({ msg: 'Post successfully removed!' });
        
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found!'});
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;