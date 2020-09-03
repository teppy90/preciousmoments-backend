const express = require('express');
const router = express.Router();
const Video = require('../models/video.js');
const Comments = require('../models/comment');
const passport = require('passport');
const responseFormatter = require('../formatters/response')


//get all vidoes 

router.post('/savecomment', (req, res) => {
    console.log(req.body)
    const comment = new Comments(req.body)
    
    comment.save((err, comment) => {
        console.log('first err is' + err)

        if(err) return res.json({success: false, err})

        Comments.find({'_id': comment._id})
        .populate('writer')
        .exec((err, result) => {
            console.log('err is' + err)
            if (err) return res.json({ success: false, err })            
            return res.status(200).json({success: true, result})
        })
    })

});

router.post("/getcomments", (req,res) => {
    console.log('postid' + req.body.postId)
    Comments.find({'postId': req.body.postId})
        .populate('writer')
        .exec((err, result) => {
            console.log('err is' + err)
            if (err) return res.json({ success: false, err })            
            return res.status(200).json({success: true, result})
        })
});

module.exports = router;