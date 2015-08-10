'use strict';

var config = require('../../../common/setup/config'),
    subscription = require('../../../common/services/subscription');

module.exports.cancelUserAndSendEmail = function (user) {
    delete user.postProcessorKey;
    subscription.endPaidSubscription(user.email);
};

module.exports.preCancelUser = function (user) {
    delete user.postProcessorKey;
    subscription.removePaidBasicPackage(user.email);
};

config.postProcessors.canceledUser = module.exports.cancelUserAndSendEmail;
config.postProcessors.preCanceledUser = module.exports.preCancelUser;
