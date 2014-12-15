'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    logger = require('../../common/config/logger'),
    config = require('../../common/config/config'),
    Country = mongoose.model('Country'),
    AppConfig = mongoose.model('AppConfig');

module.exports = {
    getAppConfig: function (req, res) {
        AppConfig.findOne({}, { _id: false}, function (err, appConfig) {
            if(err) {
                logger.logError(err);
                return res.status(500).end();
            }
            var props =  {
                environment: process.env.NODE_ENV,
                cloudSpongeDomainKey: config.cloudSpongeDomainKey,
                aioUrl: config.aioUrl
            };
            appConfig = _.assign(appConfig._doc, props);
            return res.json(appConfig);
        });
    },

    getCountries: function(req, res) {
        Country.find({}, {_id: false}, function(err, countries) {
            if(err) {
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(countries);
        });
    }
};
