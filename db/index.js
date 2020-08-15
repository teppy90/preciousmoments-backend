const mongoose = require('mongoose');
const db = mongoose.connection;

//Environment Variables 
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/upsell'

//connect to Mongo 
mongoose.connect(mongoURI, ({useNewUrlParser: true, useUnifiedTopology: true }), 
    () => console.log('MongoDB connection establised:', mongoURI)
)


//Error/Disconnection 
db.on('error', err => console.log(err.message + ' is Mongod not running?'))
db.on('disconnected', () => console.log('mongo disconnected'))
