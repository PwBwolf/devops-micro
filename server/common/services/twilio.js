'use strict';

var config = require('../setup/config'),
    _ = require('lodash'),
    logger = require('../../common/setup/logger'),
    twilio = require('twilio'),
    client = new twilio.LookupsClient(config.twilioAccountSid, config.twilioAuthToken);

module.exports = {
    isMobile: function (number, callback) {
        client.phoneNumbers(number).get({countryCode: 'US', type: 'carrier'}, function (err, details) {
            if (err) {
                logger.logError('twilio - isMobile - error fetching phone number info from twilio: ' + number);
                logger.logError(err);
                callback(err);
            } else {
                logger.logInfo(details);
                if (details && details.carrier && _.contains(config.twilioMobileType, details.carrier.type)) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            }
        });
    }
};
