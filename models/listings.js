const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
        name: { type: String },
        category: { type: String },
        description: { type: String },
        image_url: {type: String},
        quantity: { type: Number },
        price: {type: mongoose.Types.Decimal128 },
        meetup: {type: String},
        condition: {type: String},
        created_date: { type: Date, default: Date.now },
        last_updated_date: { type: Date, default: Date.now },
        userID: {type : mongoose.Schema.Types.ObjectId, ref: 'users'}
});

const Listings = mongoose.model('listings', listingSchema);

module.exports = Listings;