const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        maxlength: 50,
    },
    description: {
        type: String,
    },
    catogory: {
        type: String,
    },
    asset_id: {
        type: String,
    },
    video_url: {
        type: String,
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    }
},
    { timestamps: true })


const Video = mongoose.model('Video', videoSchema);

module.exports = Video 