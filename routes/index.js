// const { PromiseProvider } = require('mongoose');
// const { populate } = require('../models/users');



module.exports = (app) => {
    const usersController = require('../controllers/user');
    app.use('/users', usersController);
    const listingsController = require('../controllers/listings.js');
    app.use('/listings', listingsController);
    const ordersController = require('../controllers/orders.js');
    app.use('/orders', ordersController);
}


