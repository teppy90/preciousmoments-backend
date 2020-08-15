const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
            name: {
                type:String,
                maxlength:50
            },
            email: {
                type:String,
                trim:true,
                unique: 1 
            },
            password: {
                type: String,
                minglength: 5
            },
            lastname: {
                type:String,
                maxlength: 50
            },
            role : {
                type:Number,
                default: 0 
            },
            image: String,
            token : {
                type: String,
            },
            tokenExp :{
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