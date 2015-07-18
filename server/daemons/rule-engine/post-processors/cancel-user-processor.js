'use strict';

var config = require('../../../common/setup/config'),
    email = require('../../../common/services/email'),
    logger = require('../../../common/setup/logger'),
    subscription = require('../../../common/services/subscription'),
    sf = require('sf');

module.exports.cancelUserAndSendEmail = function (user) {
    delete user.postProcessorKey;
    subscription.endPaidSubscription(user.email);
};

config.postProcessors.canceledUser = module.exports.cancelUserAndSendEmail;
