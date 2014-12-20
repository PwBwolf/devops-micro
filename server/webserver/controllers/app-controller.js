'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    logger = require('../../common/config/logger'),
    config = require('../../common/config/config'),
    Visitor = mongoose.model('Visitor'),
    Country = mongoose.model('Country'),
    AppConfig = mongoose.model('AppConfig');

module.exports = {
    getAppConfig: function (req, res) {
        AppConfig.findOne({}, {_id: false}, function (err, appConfig) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            var props = {
                environment: process.env.NODE_ENV,
                cloudSpongeDomainKey: config.cloudSpongeDomainKey,
                aioUrl: config.aioUrl
            };
            appConfig = _.assign(appConfig._doc, props);
            return res.json(appConfig);
        });
    },

    getCountries: function (req, res) {
        Country.find({}, {_id: false}, function (err, countries) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(countries);
        });
    },

    saveVisitor: function (req, res) {
        Visitor.findOne({email: req.body.email}, function (err, visitor) {
            if (err) {
                logger.error(JSON.stringify(err));
            }
            if (!visitor) {
                var visitorObj = new Visitor({email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName});
                visitorObj.save(function (err) {
                    if (err) {
                        logger.error(JSON.stringify(err));
                    }
                });
            } else {
                if (req.body.firstName) {
                    visitor.firstName = req.body.firstName;
                }
                if (req.body.lastName) {
                    visitor.lastName = req.body.lastName;
                }
                if (req.body.firstName || req.body.lastName) {
                    visitor.save(function (err) {
                        if (err) {
                            logger.logError(err);
                        }
                    });
                }
            }
        });
        return res.status(200).end();
    }
};
