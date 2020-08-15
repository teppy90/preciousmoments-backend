const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/user');
const secretKey = process.env.SECRET_KEY || "upsell";

const cookieExtractor = req => {
    let token = null;
    // console.log(req.cookies['access_token']);
    // console.log(req.headers['access_token']);
    if (req && req.cookies['access_token']) {
        // console.log('cookie token?')
        token = req.cookies["access_token"]
    } else if (req && req.headers['access_token']) {
        token = req.headers['access_token'];
        // console.log("token is")
        // console.log(token)
    }
    return token;
}
//authorization (protect the edit end point)
passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: "superdanny"
}, (payload, done) => {
    User.findById({ _id: payload.sub }, (err, user) => {
        if (err) {
            return done(err, false)
        }
        if (user) {
            return done(null, user)

        } else return (null, false)
    })
}))

// authenticated local stragety using username and password 

passport.use(new LocalStrategy((username, password, done) => {
    console.log('username and password:' + username, password)

    User.findOne({ username }, (err, user) => {
        if (err) {
            return done(err)
        }
        else if (!user) {
            return done(null, false);
        } else {
            user.comparePassword(password, done);
        }
    })
}));


