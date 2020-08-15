const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
        purchaser_userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        seller_userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        quantity: { type: Number },
        amount: { type: mongoose.Types.Decimal128 },
        name: { type: String },
        category: { type: String },
        description: { type: String },
        meetup: { type: String },
        condition: { type: String },
        status: { type: String, default: "pending" },
        created_date: { type: Date, default: Date.now },
        last_updated_date: { type: Date, default: Date.now }
});

const Orders = mongoose.model('orders', orderSchema);

module.exports = Orders;