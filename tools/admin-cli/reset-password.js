'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var sf = require('sf'),
    config = require('../../server/common/config/config'),
    emailService = require('../../server/common/services/email'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2],
    password = process.argv[3];

if (typeof email === 'undefined') {
    console.log('Email is missing!\n\rUsage: node reset-password <email> <password>');
    process.exit(1);
} else {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    var isEmail = regex.test(email);
    if (!isEmail) {
        console.log('Enter a valid email address.');
        process.exit(1);
    }
}

if (typeof password === 'undefined') {
    console.log('Password is missing!\n\rUsage: node reset-password <email> <password>');
    process.exit(1);
} else {
    var hasUpperCase = /[A-Z]/.test(password);
    var hasLowerCase = /[a-z]/.test(password);
    var hasNumbers = /\d/.test(password);
    var hasNonAlphas = /\W|_/.test(password);
    var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonAlphas;
    var isComplexPassword = (password.length >= 8) && (characterGroupCount > 3);
    if (!isComplexPassword) {
        console.log('Password needs to be at least 8 characters, contain 1 uppercase & 1 lowercase letter, 1 number & 1 special character');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/config/models')(modelsPath);
var Users = mongoose.model('User');

Users.findOne({email: email}, function (err, user) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else if (!user) {
        console.log('Password cannot be changed as the user was not found.');
        process.exit(1);
    } else if (user.status === 'registered') {
        console.log('Password cannot be changed as the account is not verified.');
        process.exit(1);
    } else if (user.status === 'failed') {
        console.log('Password cannot be changed as the account was not created successfully.');
        process.exit(1);
    } else {
        user.password = password;
        user.save(function (err1) {
            if (err1) {
                console.log(err1);
                process.exit(1);
            } else {
                console.log('Password changed successfully.');
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.passwordChangedEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.passwordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName)
                };
                emailService.sendEmail(mailOptions, function (err2) {
                    if (err2) {
                        console.log(err2);
                        console.log('Unable to sent password changed email notification but password has been changed successfully.');
                        process.exit(1);
                    } else {
                        console.log('Password changed email notification sent successfully.');
                        process.exit(0);
                    }
                });
            }
        });
    }
});
