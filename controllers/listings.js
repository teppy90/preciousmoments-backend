const express = require('express');
const router = express.Router();
const Listings = require('../models/listings.js');
const User = require('../models/user')


// find by userID route 
router.get('/mylistings/:userID', (req, res) => {
    Listings.find({ userID:req.params.userID }, (err, foundListings) => {
        if (err) {
            res.status(500).json({ message: { msgbody: err, msgError: true } })
        } else {
            res.json(foundListings);
        }
    });
});


//find by id route 
router.get('/:listingID', (req, res) => {
    Listings.findById(req.params.listingID, (err, foundListings) => {
        if (err) {
            res.status(500).json({ message: { msgbody: err, msgError: true } })
        } else {
            console.log(foundListings);
            User.findById(foundListings.userID, (err, foundUser) => {
                if (err) {
                    res.status(500).json({ message: { msgbody: err, msgError: true } })
                } else {
                    res.json({
                        ...foundListings.toObject(),
                        username: foundUser.username
                    });
                }
            });
        }
    });
});

//create Index route 
router.get('/', (req, res) => {
    Listings.find({}, (err, foundListings) => {
        res.json(foundListings);
    });
});

//create Delete route 
router.delete('/:listingID/delete', (req, res) => {
    Listings.findByIdAndRemove(req.params.listingID, (err, deletedListing) => {
        res.json(deletedListing);
    });
});

//create Update route
router.put('/:listingID/update', (req, res) => {
    Listings.findByIdAndUpdate(req.params.listingID, req.body, {new:true}, (err, updatedListing) => {
        res.json(updatedListing);
    });
});

module.exports = router;