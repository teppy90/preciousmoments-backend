const express = require('express');
const router = express.Router();
const User = require('../models/user')
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const Listings = require('../models/listings');
const Orders = require('../models/orders');
const secretKey = process.env.SECRET_KEY || "upsell" ;

const signToken = userID => {
    return JWT.sign({
        iss: secretKey,
        sub: userID
    }, secretKey, { expiresIn: "1h" })
}

//find all route
router.get('/', (req, res) => {
    User.find({}, (err, foundUser) => {
        res.json(foundUser);
    });
});

router.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { username, _id, wallet } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { username, _id, wallet } });
})

router.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.clearCookie('access_token');
    res.json({ user: { username: "" }, success: true });
})
//find by username by id route 
router.get('/:userID', (req, res) => {
    User.findById(req.params.userID, (err, foundUser) => {
        if (err) {
            res.status(500).json({ message: { msgbody: err, msgError: true } })
        } else {
            foundUser.password = null;
            res.json(foundUser);
        }
    });
});

// User register 
router.post('/signup', (req, res) => {
    const { username, password, email, mobile } = req.body
    User.findOne({ username }, (err, user) => {
        if (err) {
            res.status(500).json({ message: "Error has occured!" })
        } else if (user) {
            res.status(500).json({ message: "Username is already taken!" })
        } else {
            const newUser = new User({ username, password, email, mobile });
            newUser.save(err => {
                if (err) {
                    res.status(500).json({ message: "Username is already taken!" })
                } else {
                    res.status(201).json({ message: "Account successfully create" })
                }
            })
        }
    })
})

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
    // console.log('reqbody' + req.body)
    const listing = new Listings(req.body);
    // console.log('listing' + listing)
    listing.save(err => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        else {
            // console.log('requser' + req.user)
            listing.userID = req.user;
            listing.save(err => {
                if (err)
                    res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
                else {
                    res.status(200).json({ message: { msgBody: "Successfully created listing", msgError: false } });
                }
            })
        }
    })
});

router.post('/order', passport.authenticate('jwt', { session: false }), (req, res) => {
    const order = new Orders(req.body);
    order.save(err => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        else {
            order.purchaser_userID = req.user._id;
            order.save(err => {
                if (err)
                    res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
                else {
                    res.status(200).json({ message: { msgBody: "Successfully created listing", msgError: false } });
                }
            })
        }
    })
});

router.post(
    '/login',
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            console.log("err and user" + err, user)
            if (err) { //unknown server error 
                next(err)
            }
            if (!user) { //empty case
                res.status(400).json({ message: 'Invalid Username or password' })
            }
            else req.logIn(user, { session: false }, err => {
                if (err) {
                    next(err) //for password? check later
                }
                const { _id, username, wallet } = req.user; //success case
                const token = signToken(_id);
                res.cookie('access_token', token, { httpOnly: true });
                res.status(200).json({ isAuthenticated: true, user: { username, _id, wallet, token } });
            }
            )
        })(req, res, next)
    }
);


module.exports = router;