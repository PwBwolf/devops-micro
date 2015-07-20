'use strict';

var config = require('../../../common/setup/config'),
    subscription = require('../../../common/services/subscription');

module.exports.cancelUserAndSendEmail = function (user) {
    delete user.postProcessorKey;
    subscription.endPaidSubscription(user.email);
};

config.postProcessors.canceledUser = module.exports.cancelUserAndSendEmail;
