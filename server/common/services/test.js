process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var twilio = require('./twilio');
var config = require('../../common/setup/config');

twilio.sendSms(config.twilioSmsSendMobileNumber, '(310) 746-5333', 'YipTV test message', function(err, response) {
    console.log(err);
    console.log(response);
});
