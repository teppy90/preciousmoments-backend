const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
        googleId: {
                type: String,
        },
        displayName: {
                type: String,
                maxlength: 50
        },
        password: {
                type: String,
                minlength: 5
        },
        firstName: {
                type: String,
                maxlength: 50
        },
        lastName: {
                type: String,
                maxlength: 50
        },
        email: {
                type: String,
        },
        role: {
                type: Number,
                default: 0
        },
        image: String,
        token: {
                type: String,
        },
        tokenExp: {
                type: Number
        }
});

userSchema.pre('save', function (next) {
        if (!this.isModified('password'))
                return next();
        bcrypt.hash(this.password, 10, (err, passwordHash) => {
                if (err)
                        return next(err);
                this.password = passwordHash;
                next();
        });

});

userSchema.methods.comparePassword = function (password, cb) {
        bcrypt.compare(password, this.password, (err, isMatch) => {
                if (err)
                        return cb(err);
                else {
                        if (!isMatch)
                                return cb(null, isMatch);
                        return cb(null, this)
                }
        })
}


const User = mongoose.model('users', userSchema);

module.exports = User;