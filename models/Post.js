const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        // Reference or connect the user to their posts (creation / deletion)
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    avatar: {
        type: String
    },
    // An array of user objects with ids to associate with likes
    likes: [
        {
            user: {
                // User object id
                type: Schema.Types.ObjectId,
                // to reference which likes came from which user - limiting likes to one per user
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                // User object id
                type: Schema.Types.ObjectId,
                // to reference which comments came from which user
                ref: 'users'
            },
            // Comments require text
            text: {
               type: String,
               required: true 
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            // Comments date
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    // Post date
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);