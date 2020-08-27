const express = require('express');
const router = express.Router();
const Video = require('../models/video.js');
const User = require('../models/user')

//get all vidoes 

router.get('/', (req, res) => {
    Video.find()
    .populate('writer')
    .exec((err, videos) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos })
    })

});

router.post('/post', (req, res)=>{
    Video.create(req.body, (err, createdVideo)=>{
        res.json(createdVideo); //.json() will send proper headers in response so client knows it's json coming back
    });
});


//create Delete route 
router.delete('/:videoID/delete', (req, res) => {
    Video.findByIdAndRemove(req.params.videoID, (err, deletedVideo) => {
        res.json(deletedVideo);
    });
});

//create Update route
router.put('/:videoID/update', (req, res) => {
    Video.findByIdAndUpdate(req.params.videoID, req.body, {new:true}, (err, updatedVideo) => {
        res.json(updatedVideo);
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