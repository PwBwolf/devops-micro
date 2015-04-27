'use strict';

var mongoose = require('mongoose'),
    logger = require('../../common/config/logger'),
    config = require('../../common/config/config'),
    dbYip = mongoose.createConnection(config.db),
    dbMerchant = mongoose.createConnection(config.merchantDb),
    User = dbYip.model('User'),
    Merchant = dbMerchant.model('Merchant'),
    monq = require('monq'),
    queueDb = monq(config.merchantDb),
    queue = queueDb.queue('api-requests');

module.exports = {
    doesUsernameExist: function (req, res) {
        validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result) {
            if (err) {
                logger.logError('merchantController - doesUsernameExist - error validating credentials');
                logger.logError(err);
                return res.status(200).send({error: 'server-error'});
            }
            if (!result) {
                return res.status(200).send({error: 'unauthorized'});
            }
            if (!req.query.username) {
                return res.status(200).send({error: 'invalid-username'});
            }
            User.findOne({email: req.query.username.toLowerCase()}, function (err1, user) {
                if (err1) {
                    logger.logError('merchantController - doesUsernameExist - error fetching user: ' + req.query.email);
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                return res.status(200).send({result: user !== null});
            });
        });
    },

    addUser: function (req, res) {
        validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result) {
            if (err) {
                logger.logError('merchantController - addUser - error validating credentials');
                logger.logError(err);
                return res.status(200).send({error: 'server-error'});
            }
            if (!result) {
                return res.status(200).send({error: 'unauthorized'});
            }
            queue.enqueue('addUser', req.body, function (err) {
                if (err) {
                    logger.logError('merchantController - addUser - error adding job to queue: ' + data);
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                } else {
                    return res.status(200).send({result: 'success'});
                }
            });
        });
    },

    makePayment: function (req, res) {
        validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result) {
            if (err) {
                logger.logError('merchantController - makePayment - error validating credentials');
                logger.logError(err);
                return res.status(200).send({error: 'server-error'});
            }
            if (!result) {
                return res.status(200).send({error: 'unauthorized'});
            }
            queue.enqueue('makePayment', req.body, function (err) {
                if (err) {
                    logger.logError('merchantController - makePayment - error adding job to queue: ' + data);
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                } else {
                    return res.status(200).send({result: 'success'});
                }
            });
        });
    }
};

function validateCredentials(merchantId, apiKey, cb) {
    if (merchantId && apiKey) {
        if (!(/^[0-9a-fA-F]{24}$/.test(merchantId))) {
            cb(null, false);
        } else {
            Merchant.findOne({_id: merchantId}, function (err, merchant) {
                if (err) {
                    logger.logError('merchantController - validateCredentials - error fetching merchant: ' + merchantId);
                    logger.logError(err);
                    cb(err);
                } else {
                    cb(null, (merchant && merchant.apiKey === apiKey));
                }
            });
        }
    } else {
        cb(null, false);
    }
}
