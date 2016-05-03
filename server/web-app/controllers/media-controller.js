'use strict';

var _ = require('lodash'),
    crypto = require('crypto'),
    moment = require('moment'),
    logger = require('../../common/setup/logger'),
    date = require('../../common/services/date'),
    cms = require('../../common/services/cms'),
    config = require('../../common/setup/config'),
    mongoose = require('../../node_modules/mongoose'),
    async = require('../../node_modules/async'),
    User = mongoose.model('User');

module.exports = {
    getChannelUrl: function (req, res) {
        cms.getRoutes(req.query.id, function (err, data) {
            if (err) {
                logger.logError('mediaController - getChannelUrl - error fetching channel url');
                logger.logError(err);
                return res.status(500).end();
            }
            if (data && data.routes && data.routes.length > 0) {
                return res.json(data);
            } else {
                return res.status(500).end();
            }
        });
    },

    getEpg: function (req, res) {
        cms.getLineup(req.query.id, req.query.hours, function (err, data) {
            if (err) {
                logger.logError('mediaController - getEpg - error fetching lineup');
                logger.logError(err);
                return res.status(500).end();
            }
            if (data) {
                return res.json(data);
            } else {
                return res.status(500).end();
            }
        });
    },

    getUserChannels: function (req, res) {
        User.findOne({email: req.email}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('mediaController - getUserChannels - error fetching user: ' + req.email);
                logger.logError(err);
                return res.status(500).end();
            }
            var packages = 'free';
            var diff = moment.utc().startOf('day').diff(moment(user.account.startDate).utc().startOf('day'), 'days');
            if (user.account.type === 'paid' || user.account.type === 'comp') {
                packages = 'free,premium,paid'
            } else if (user.account.type === 'free' && diff <= 7 && !user.cancelDate && !user.complimentaryEndDate) {
                packages = 'free,premium'
            }
            cms.getChannels(packages, function (err, data) {
                if (err) {
                    logger.logError('mediaController - getUserChannels - error fetching channels');
                    logger.logError(err);
                    return res.status(500).end();
                }
                if (data && data.channels_list && data.channels_list.length > 0) {
                    return res.json(data);
                } else {
                    return res.status(500).end();
                }
            });
        });
    },

    getChannelCategories: function (req, res) {
        cms.getTags(function (err, data) {
            if (err) {
                logger.logError('mediaController - getChannelCategories - error fetching categories');
                logger.logError(err);
                return res.status(500).end();
            }
            if (data && data.categories && data.categories.length > 0) {
                return res.json(data);
            } else {
                return res.status(500).end();
            }
        });
    }
};
