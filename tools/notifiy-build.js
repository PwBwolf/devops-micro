var config = require('../server/common/config/config');
var email = require('../server/common/services/email');

var moment = require('moment');
var sf = require('sf');
var fs = require('fs-extended');

var env = process.env.NODE_ENV || 'development';

var versionJSON = fs.readJSONSync('../client/version.json');

var mailOptions = {
    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
    to: 'devteam@yiptv.com',
    subject: sf('New build ({0}) deployed to {1}', versionJSON.version, env),
    html: sf('New build ({0}) deployed to {1} on {2}', versionJSON.version, argv.env, moment().format('MMMM Do YYYY, h:mm:ss a'));
};

email.sendEmail(mailOptions, function (err) {
    console.log('New build notification email sent...');
    if (err) {
        console.log(err);
    }
});
