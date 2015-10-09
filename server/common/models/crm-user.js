'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var CrmUser = new Schema({
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
    status: {type: String, required: true},
    createdAt: {type: Date, required: true},
    lastLoginTime: Date,
    verificationCode: {type: String, sparse: true},
    resetPasswordCode: {type: String, sparse: true}
}, {collection: 'CrmUsers'});

CrmUser.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

CrmUser.methods = {
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

mongoose.model('CrmUser', CrmUser);
