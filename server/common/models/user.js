'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var User = new Schema({
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    hashedPassword: {type: String, required: false},
    salt: {type: String, required: false},
    role: {
        type: {
            bitMask: {type: Number, required: true},
            title: {type: String, required: true}
        },
        required: true
    },
    oldInactiveUser: Number,
    status: {type: String, required: true, index: true},
    createdAt: {type: Date, required: true, index: true},
    upgradeDate: {type: Date, required: false},
    cancelDate: {type: Date, required: false},
    complimentaryEndDate: {type: Date, required: false},
    cancelOn: {type: Date, required: false},
    validTill: {type: Date, required: false},
    lastLoginTime: Date,
    verificationPin: {type: Number},
    resetPasswordPin: {type: Number},
    account: {type: Schema.Types.ObjectId, ref: 'Account'},
    preferences: {
        defaultLanguage: {type: String, required: true, lowercase: true},
        emailSmsSubscription: {type: Boolean}
    },
    favoriteChannels: [Number]
}, {collection: 'Users'});

User.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
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
