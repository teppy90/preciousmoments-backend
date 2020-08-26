//Dependencies 
const express = require('express');
const mongoose = require('mongoose')
const app = express();
const port = process.env.PORT || 3002;
const frontEndUrl = process.env.FRONT_END_URL;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const passport = require('passport')
require("dotenv").config()
require('./db');
const cors = require("cors")

//middlewares 

app.use(
    cors({
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    })
  );
app.use(express.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize());

//routes
require('./routes')(app);

//this will catch any route that doesn't exist 
app.get('*', (req, res) => {
    res.status(404).json('Sorry, page not found')
})


app.listen(port, () => {
    console.log('I am listening to port:', port)
})



