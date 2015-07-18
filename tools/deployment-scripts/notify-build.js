'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config');
var email = require('../../server/common/services/email');
var moment = require('../../server/node_modules/moment/moment');
var sf = require('../../server/node_modules/sf/sf');
var fs = require('../../server/node_modules/fs-extended/index');
var versionJson = fs.readJSONSync('../client/version.json');

var mailOptions = {
    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
    to: 'devteam@yiptv.com',
    subject: sf('New build ({0}) deployed to {1}', versionJson.version, process.env.NODE_ENV),
    html: sf('New build ({0}) deployed to {1} on {2}', versionJson.version, process.env.NODE_ENV, moment().format('MMMM Do YYYY, h:mm:ss a'))
};

email.sendEmail(mailOptions, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('New build notification email sent...');
    }
});
