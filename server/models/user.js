'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var User = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    hashedPassword: {type: String, required: true},
    salt: {type: String, required: true},
    role: { type: {
        bitMask: { type: Number, required: true },
        title: {type: String, required: true }
    }, required: true },
    activate: Boolean,
    disabled: Boolean,
    deleted: Boolean,
    createdAt: {type: Date, required: true},
    lastLoginTime: Date,
    verificationCode: String,
    resetPasswordCode: String,
    account: {type: Schema.Types.ObjectId, ref: 'Account'},
    preferences: {
        defaultLanguage: {type: String, required: true, lowercase: true},
        favoriteChannels: [{type: Schema.Types.ObjectId, ref: 'Channel'}],
        defaultChannel: {type: Schema.Types.ObjectId, ref: 'Channel'},
        timezone: String
    },
    profile: {
        age: Number,
        sex: String,
        address: {
            address1: String,
            address2: String,
            city: String,
            state: String,
            country: String,
            zip: String
        }
    }
}, { collection: 'Users' });

User.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

var validatePresenceOf = function (value) {
    return value && value.length;
};

User.path('firstName').validate(function (firstName) {
    return firstName.length;
}, 'First Name cannot be blank');

User.path('lastName').validate(function (lastName) {
    return lastName.length;
}, 'Last Name cannot be blank');

User.path('email').validate(function (email) {
    return email.length;
}, 'Email cannot be blank');

User.path('role').validate(function (role) {
    return role.length;
}, 'Role cannot be blank');

User.path('hashedPassword').validate(function (hashedPassword) {
    return hashedPassword.length;
}, 'Password cannot be blank');

User.pre('save', function (next) {
    if (!this.isNew) {
        return next();
    }
    if (!validatePresenceOf(this.password)) {
        return next(new Error('Invalid password'));
    } else {
        return next();
    }
});

User.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },

    encryptPassword: function (password) {
        if (!password || !this.salt) {
            return '';
        }
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

mongoose.model('User', User);
