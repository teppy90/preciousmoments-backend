const express = require('express');
const router = express.Router();
const Listings = require('../models/listings.js');
const Orders = require('../models/orders')

// find by userID route
router.get('/:userID', (req, res) => {
    Orders.find({ purchaser_userID: req.params.userID }, (err, foundOrders) => {
        if (err) {
            res.status(500).json({ message: { msgbody: err, msgError: true } })
        } else {
            res.json(foundOrders);
        }
    });
});

module.exports = router;