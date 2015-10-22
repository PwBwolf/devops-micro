'use strict';

var config = require('../setup/config'),
    _ = require('lodash'),
    logger = require('../../common/setup/logger'),
    twilio = require('twilio'),
    client = twilio(config.twilioAccountSid, config.twilioAuthToken),
    lookupClient = new twilio.LookupsClient(config.twilioAccountSid, config.twilioAuthToken);

module.exports = {
    isMobile: function (number, callback) {
        lookupClient.phoneNumbers(number).get({countryCode: 'US', type: 'carrier'}, function (err, response) {
            if (err) {
                logger.logError('twilio - isMobile - error fetching phone number info from twilio: ' + number);
                logger.logError(err);
                callback(err);
            } else {
                logger.logInfo(response);
                if (response && response.carrier && _.contains(config.twilioMobileType, response.carrier.type)) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            }
        });
    },

    sendSms: function (from, to, message, callback) {
        client.sendSms({to: to, from: from, body: message}, function (err, response) {
            if (err) {
                logger.logError('twilio - sendSms - error sending sms: ' + to);
                logger.logError(err);
            } else {
                logger.logInfo(response);
            }
            callback(err, response);
        });
    }
};
