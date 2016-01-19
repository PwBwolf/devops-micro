'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('../../../server/node_modules/mongoose'),
    logger = require('../../../server/common/setup/logger'),
    config = require('../../../server/common/setup/config'),
    modelsPath = config.root + '/server/common/models',
    db = mongoose.createConnection(config.db);
var xmlrpc = require('../../../server/node_modules/xmlrpc');


require('../../../server/common/setup/models')(modelsPath);

var User = db.model('User'),
    Account = db.model('Account'),
    Merchant = db.model('Merchant'),
    subscription = require('../../../server/common/services/subscription');

var userEmail = 'yip.yliu@gmail.com';
var agentNum = 2;
var yipSecret = 'yip-freeside-dev';
var freesideUrl = 'http://172.16.10.5:8008/';

User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
    if (err) {
        logger.logError('subscription - upgradeSubscription - error fetching user: ' + userEmail);
        logger.logError(err);
    } else {
        if (!userObj) {
            logger.logError('subscription - upgradeSubscription - user not found: ' + userEmail);
            logger.logError('user not found');
        } else {
            var custNum = userObj.account.freeSideCustomerNumber;
            var client = xmlrpc.createClient(freesideUrl);
            
            client.methodCall('FS.API.update_customer', 
                [
                    'secret', yipSecret,
                    'custnum', custNum,
                    'agentnum', agentNum
                ], 
                function(error, result) {
                    if(error) {
                        logger.logError('FS.API.update_customer failed');
                        logger.logError(error);
                    } else {
                        logger.logInfo('backoffice' + result);
                    }
            });
        }
    }
});