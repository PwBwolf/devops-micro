'Use Strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    passwordHash: String,
    salt: String,
    activated: Boolean,
    enabled: Boolean,
    deleted: Boolean,
    created: Date,
    lastLoginTime: Date,
    verificationCode: String,
    resetPasswordCode: String,
    account: {type: Schema.Types.ObjectId, ref: 'Account'},
    preferences: {
        favoriteChannels: [{type: Schema.Types.ObjectId, ref: 'Channel'}],
        defaultChannel: {type: Schema.Types.ObjectId, ref: 'Channel'},
        timezone: String
    },
    profile: {
        age: Number,
        sex: String,
        address: {

        }
    }
});

// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

//Password verification
User.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};

mongoose.model("User", User);



