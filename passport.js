const passport = require('passport')
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');
const secretOrKey = process.env.SECRET_KEY;
// const consumerKey = process.env.GOOGLE_CONSUMER_KEY || '1027033582659-u2o4asl9og5gkgieq7kbtihn6cn9m965.apps.googleusercontent.com';
// const consumerSecret = process.env.GOOGLE_CONSUMER_SECRET || 'UESJxhi3j7OaB_NNyBDl-2RL';

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

//authorization
passport.use(new JwtStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey
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

//google auth   

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3002/users/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value
      }

      try {
        let user = await User.findOne({ googleId: profile.id })

        if (user) {
          done(null, user)
        } else {
          user = await User.create(newUser)
          done(null, user)
        }
      } catch (err) {
        console.error(err)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user))
})


// authenticated local stragety using username and password 

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (username, password, done) => {

  console.log('username and password:' + username, password)

  User.findOne({ email: username }, (err, user) => {
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

