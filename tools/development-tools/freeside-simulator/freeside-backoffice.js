'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('../../../server/node_modules/mongoose'),
    logger = require('../../../server/common/setup/logger'),
    config = require('../../../server/common/setup/config'),
    modelsPath = config.root + '/server/common/models',
    //db = mongoose.createConnection(config.db);
    db = mongoose.createConnection('mongodb://yipUser:y1ptd3v@172.16.10.8/yiptv');
var xmlrpc = require('../../../server/node_modules/xmlrpc');


require('../../../server/common/setup/models')(modelsPath);

var User = db.model('User'),
    Account = db.model('Account'),
    Merchant = db.model('Merchant'),
    subscription = require('../../../server/common/services/subscription');

var userEmail = 'garien88+100@gmail.com';//'yip.yliu+66@gmail.com';//
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
            /*
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
                        if (result.error) {
                            logger.logError('FS.API.update_customer failed 2');
                            logger.logError(result.error);
                        } else {
                            logger.logInfo('FS.API.update_customer succeed from backoffice ' + result);
                            var now = (new Date().getTime()/1000).toFixed(0);
                            client.methodCall('FS.API.insert_payment', 
                                [
                                     'secret', yipSecret,
                                     'custnum', custNum,
                                     'payby', 'IDTP',
                                     'paid', '14.99',
                                     '_date', now
                                ], 
                                function(error, res) {
                                if(error) {
                                    logger.logError('FS.API.insert_payment failed');
                                    logger.logError(error);
                                } else {
                                    if(res.error) {
                                        logger.logError('FS.API.insert_payment failed 2');
                                        logger.logError(res.error);
                                    } else {
                                        logger.logInfo('FS.API.insert_payment succeed from backoffice ' + res);
                                    }
                                }
                            });
                        }
                    }
            });
            */
            
            var now = (new Date().getTime()/1000).toFixed(0);
            client.methodCall('FS.API.insert_payment', 
                [
                     'secret', yipSecret,
                     'custnum', custNum,
                     'payby', 'IDTP',
                     'paid', '14.99',
                     '_date', now
                ], 
                function(error, res) {
                if(error) {
                    logger.logError('FS.API.insert_payment failed');
                    logger.logError(error);
                } else {
                    if(res.error) {
                        logger.logError('FS.API.insert_payment failed 2');
                        logger.logError(res.error);
                    } else {
                        logger.logInfo('FS.API.insert_payment succeed from backoffice ' + res);
                    }
                }
            });
            
        }
    }
});