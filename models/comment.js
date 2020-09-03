const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const commentsSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId, 
        ref: 'users'
    },
    postId: {
        type: Schema.Types.ObjectId, 
        ref: 'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId, 
        ref: 'users'
    },
    content: {
        type: String
    }
    
},{ timestamps: true })

const Comments = mongoose.model('comments', commentsSchema);

module.exports = Comments;