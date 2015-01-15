'use strict';

var mongoose = require('mongoose'),
    logger = require('../../common/config/logger'),
    User = mongoose.model('User');

module.exports = {
    getAllUsers: function (req, res) {
        User.find({}, {_id: 0, email:1, firstName:1, lastName:1, account: 1}).populate('account', 'type').exec(function (err, data) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(data);
        });
    },

    getUserDetails: function (req, res) {
        User.find({email: req.query.email}).populate('account').exec(function (err, data) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(data);
        });
    }
};
