const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
        username: {
                type: String,
                required: true,
                min: 6,
                max: 15
        },
        password: {
                type: String,
                required: true,
                min: 8,
                max: 15
        },
        email: {
                type: String,
                lowercase: true,
                required: true 
        },
        mobile: {
                type: Number,
                required: true 
        },
        created_date: { type: Date, default: Date.now },
        wallet: {
                type: mongoose.Types.Decimal128,
                default: 4000
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