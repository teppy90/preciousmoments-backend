const express = require('express');
const router = express.Router();
const Video = require('../models/video.js');
const User = require('../models/user');
const passport = require('passport');

//get all vidoes 

router.get('/', (req, res) => {
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })

});


router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    let data = new Object();
    [data.title, data.description, data.category, data.writer, data.asset_id, data.video_url]
        = [req.body.title, req.body.description, req.body.category, req.user, req.body.cloud.asset_id, req.body.cloud.secure_url]
    const video = new Video(data);
    video.save(err => {
        if (err) {
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        } else {
            res.status(200).json({ message: { msgBody: "Successfully created listing", msgError: false } });
        }
    })
});


//create Delete route 
router.delete('/:videoID/delete', (req, res) => {
    Video.findByIdAndRemove(req.params.videoID, (err, deletedVideo) => {
        res.json(deletedVideo);
    });
});

//create Update route
router.put('/:videoID/update', (req, res) => {
    Video.findByIdAndUpdate(req.params.videoID, req.body, { new: true }, (err, updatedVideo) => {
        res.json(updatedVideo);
    });
});



router.post("/uploadVideo", (req, res) => {

    const video = new Video(req.body)

    video.save((err, video) => {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({
            success: true 
        })
    })

});

//find video by id (for playvideopage)

router.post("/getVideo", (req, res) => {
    Video.findOne({ "_id" : req.body.videoId })
    .populate('writer')
    .exec((err, video) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, video })
    })
});


// find by userID route 

    router.get('/:userID', (req, res) => {
            Video.find({ writer:req.params.userID }, (err, foundVideo) => {
                if (err) {
                    res.status(500).json({ message: { msgbody: err, msgError: true } })
                } else {
                    res.json(foundVideo);
                }
            });
        });

// // find by userID route 
// router.get('/myVideo/:userID', (req, res) => {
//     Video.find({ userID:req.params.userID }, (err, foundVideo) => {
//         if (err) {
//             res.status(500).json({ message: { msgbody: err, msgError: true } })
//         } else {
//             res.json(foundVideo);
//         }
//     });
// });




//find by id route 
// router.get('/:videoID', (req, res) => {
//     Video.findById(req.params.videoID, (err, foundVideo) => {
//         if (err) {
//             res.status(500).json({ message: { msgbody: err, msgError: true } })
//         } else {
//             console.log(foundVideo);
//             User.findById(foundVideo.userID, (err, foundUser) => {
//                 if (err) {
//                     res.status(500).json({ message: { msgbody: err, msgError: true } })
//                 } else {
//                     res.json({
//                         ...foundVideo.toObject(),
//                         email: foundUser.email
//                     });
//                 }
//             });
//         }
//     });
// });



module.exports = router;

