'use strict';

var mongoose = require('mongoose'),
    logger = require('../../common/config/logger'),
    config = require('../../common/config/config'),
    dbYip = mongoose.createConnection(config.db),
    dbMerchant = mongoose.createConnection(config.merchantDb),
    User = dbYip.model('User'),
    Merchant = dbMerchant.model('Merchant');

module.exports = {
    doesUsernameExist: function (req, res) {
        validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result) {
            if (err) {
                return res.status(500).end('server-error');
            }
            if (!result) {
                return res.status(401).end('unauthorized');
            }
            if (!req.query.username) {
                return res.status(400).end('invalid-username');
            }
            User.findOne({email: req.query.username.toLowerCase()}, function (err1, user) {
                if (err1) {
                    logger.logError('merchantController - doesUsernameExist - error fetching user: ' + req.query.email);
                    logger.logError(err);
                    return res.status(500).end('server-error');
                }
                return res.status(200).send(user !== null);
            });
        });
    },

    addUser: function (req, res) {
        return res.status(200).end();
    },

    makePayment: function (req, res) {
        return res.status(200).end();
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
