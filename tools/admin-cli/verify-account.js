'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/config/config'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2];

if (typeof email === 'undefined') {
    console.log('Email is missing!\n\rUsage: node verify-account <email>');
    process.exit(1);
} else {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    var isEmail = regex.test(email);
    if (!isEmail) {
        console.log('Enter a valid email address.');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/config/models')(modelsPath);
var Users = mongoose.model('User');

Users.findOne({email: email.toLowerCase()}, function (err, user) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else if (!user) {
        console.log('Account cannot be verified as the user was not found.');
        process.exit(1);
    } else if (user.status === 'failed') {
        console.log('Account cannot be changed as the account was not created successfully.');
        process.exit(1);
    } else if (user.status !== 'registered') {
        console.log('Account is already verified.');
        process.exit(1);
    } else {
        user.status = 'active';
        user.verificationCode = undefined;
        user.save(function (err1) {
            if (err) {
                console.log(err1);
                process.exit(1);
            } else {
                console.log('Account verified successfully.');
                process.exit(0);
            }
        });
    }
});
