const express = require('express');
const router = express.Router();
const User = require('../models/user')
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY 

const signToken = userID => {
    console.log('userID is' + userID)
    return JWT.sign({
        iss: secretKey,
        sub: userID
    }, secretKey, { expiresIn: "1h" })
}


const googlesignToken = userID => {
    console.log('userID is' + userID)
    return JWT.sign({
        iss: secretKey,
        sub: userID._id
    }, secretKey, { expiresIn: "1h" })
}

//google auth 

router.get(
    '/google',
    passport.authenticate('google', {
        scope: [
            'profile'
        ]
    })
)

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        return res
            .cookie('access_token', googlesignToken(req.user))
            .redirect("http://localhost:3002")
            //res.status(200).json({ isAuthenticated: true, user: { email, _id, token } });

    }
)

//find all route
router.get('/', (req, res) => {
    User.find({}, (err, foundUser) => {
        res.json(foundUser);
    });
});

router.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { email, _id } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { email, _id } });
})

router.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.clearCookie('access_token');
    res.json({ user: { email: "" }, success: true });
})
//find by email by id route 
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
    const { email, password, name, lastname } = req.body
    User.findOne({ email }, (err, user) => {
        if (err) {
            res.status(500).json({ message: "Error has occured!" })
        } else if (user) {
            res.status(500).json({ message: "Email is already taken!" })
        } else {
            const newUser = new User({ email, password, name, lastname });
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

router.post(
    '/login',
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            console.log("err and user" + err, user)
            if (err) { //unknown server error 
                next(err)
            }
            if (!user) { //empty case
                res.status(400).json({ message: 'Invalid email or password' })
            }
            else req.logIn(user, { session: false }, err => {
                if (err) {
                    next(err) //for password? check later
                }
                const { _id, email } = req.user; //success case
                const token = signToken(_id);
                res.cookie('access_token', token, { httpOnly: true });
                res.status(200).json({ isAuthenticated: true, user: { email, _id, token } });
            }
            )
        })(req, res, next)
    }
);


module.exports = router;