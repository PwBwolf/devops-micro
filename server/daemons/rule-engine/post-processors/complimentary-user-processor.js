'use strict';

var config = require('../../../common/setup/config'),
    subscription = require('../../../common/services/subscription');

function suspendAccount(user) {
    subscription.endComplimentarySubscription(user.email);
}

module.exports.complimentaryAccountEnd = function (user) {
    delete user.postProcessorKey;
    suspendAccount(user);
};

config.postProcessors.complimentaryEnded = module.exports.complimentaryAccountEnd;
