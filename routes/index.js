// const { PromiseProvider } = require('mongoose');
// const { populate } = require('../models/users');



module.exports = (app) => {
    const usersController = require('../controllers/user');
    app.use('/users', usersController);

    const videoController = require('../controllers/videos');
    app.use('/videos', videoController);

    const commentController = require('../controllers/comments')
    app.use('/comments', commentController);

}


