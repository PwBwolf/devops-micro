'use strict';

var mongoose = require('mongoose'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    Country = mongoose.model('Country'),
    State = mongoose.model('State');

module.exports = {
    getAppConfig: function (req, res) {
        var appConfig = {
            appName: config.appName,
            environment: process.env.NODE_ENV,
            url: config.url,
            imageUrl: config.imageUrl,
            aioPortalUrl: config.aioPortalUrl,
            wordPressUrl: config.wordPressUrl,
            customerCareNumber: config.customerCareNumber,
            graceNoteImageUrl: config.graceNoteImageUrl
        };
        return res.json(appConfig);
    },

    getCountries: function (req, res) {
        Country.find({}, {_id: false}, {sort: {name: 1}}, function (err, countries) {
            if (err) {
                logger.logError('appController - getCountries - error fetching country list');
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(countries);
        });
    },

    getStates: function (req, res) {
        State.find({}, {_id: false}, {sort: {name: 1}}, function (err, states) {
            if (err) {
                logger.logError('appController - getStates - error fetching state list');
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(states);
        });
    }
};
