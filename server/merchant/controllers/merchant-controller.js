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
        try {
            validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result) {
                if (err) {
                    logger.logError('merchantController - doesUsernameExist - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                if (!result) {
                    return res.status(200).send({error: 'unauthorized'});
                }
                var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
                if (!req.query.username || !emailRegex.test(req.query.username)) {
                    return res.status(200).send({error: 'invalid-username'});
                }
                User.findOne({email: req.query.username.toLowerCase()}, function (err1, user) {
                    if (err1) {
                        logger.logError('merchantController - doesUsernameExist - error fetching user: ' + req.query.email);
                        logger.logError(err);
                        return res.status(200).send({error: 'server-error'});
                    }
                    return res.status(200).send({error: '', result: user !== null});
                });
            });
        } catch (ex) {
            logger.logError('merchantController - doesUsernameExist - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        }
    },

    addUser: function (req, res) {
        try {
            validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result) {
                if (err) {
                    logger.logError('merchantController - addUser - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                if (!result) {
                    return res.status(200).send({error: 'unauthorized'});
                }
                req.body.merchantId = req.query.merchantId;
                queue.enqueue('addUser', req.body, function (err) {
                    if (err) {
                        logger.logError('merchantController - addUser - error adding job to queue');
                        logger.logError(err);
                        return res.status(200).send({error: 'server-error'});
                    } else {
                        return res.status(200).send({error: '', result: 'success'});
                    }
                });
            });
        } catch (ex) {
            logger.logError('merchantController - addUser - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        }
    },

    makePayment: function (req, res) {
        try {
            validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result) {
                if (err) {
                    logger.logError('merchantController - makePayment - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                if (!result) {
                    return res.status(200).send({error: 'unauthorized'});
                }
                req.body.merchantId = req.query.merchantId;
                queue.enqueue('makePayment', req.body, function (err) {
                    if (err) {
                        logger.logError('merchantController - makePayment - error adding job to queue');
                        logger.logError(err);
                        return res.status(200).send({error: 'server-error'});
                    } else {
                        return res.status(200).send({error: '', result: 'success'});
                    }
                });
            });
        } catch (ex) {
            logger.logError('merchantController - makePayment - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        }
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
