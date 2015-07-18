'use strict';

var config = require('../../../common/setup/config'),
    subscription = require('../../../common/services/subscription');

module.exports.complimentaryAccountEnd = function (user) {
    delete user.postProcessorKey;
    subscription.endComplimentarySubscription(user.email);
};

config.postProcessors.complimentaryEnded = module.exports.complimentaryAccountEnd;
