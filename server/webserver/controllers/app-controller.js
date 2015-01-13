'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    logger = require('../../common/config/logger'),
    config = require('../../common/config/config'),
    ContactUs = mongoose.model('ContactUs'),
    Referrer = mongoose.model('Referrer'),
    Visitor = mongoose.model('Visitor'),
    Country = mongoose.model('Country'),
    AppConfig = mongoose.model('AppConfig'),
    Hashids = require('hashids'),
    hashids = new Hashids(config.secretToken, 5),
    email = require('../../common/services/email'),
    sf = require('sf');

module.exports = {
    getAppConfig: function (req, res) {
        AppConfig.findOne({}, {_id: false}, function (err, appConfig) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            var props = {
                environment: process.env.NODE_ENV,
                url: config.url,
                aioUrl: config.aioUrl
            };
            appConfig = _.assign(appConfig._doc, props);
            return res.json(appConfig);
        });
    },

    getCountries: function (req, res) {
        Country.find({}, {_id: false},  {sort: {name: 1}}, function (err, countries) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(countries);
        });
    },

    saveVisitor: function (req, res) {
        Visitor.findOne({email: req.body.email.toLowerCase()}, function (err, visitor) {
            if (err) {
                logger.error(JSON.stringify(err));
            }
            if (!visitor) {
                var visitorObj = new Visitor({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    createdAt: (new Date()).toUTCString()
                });
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
                    visitor.updatedAt = (new Date()).toUTCString();
                    visitor.save(function (err) {
                        if (err) {
                            logger.logError(err);
                        }
                    });
                }
            }
        });
        return res.status(200).end();
    },

    saveContactUs: function (req, res) {
        var contactUs = new ContactUs({
            name: req.body.name,
            email: req.body.email,
            telephone: req.body.telephone,
            ymId: req.body.ymId,
            skypeId: req.body.skypeId,
            country: req.body.country,
            interest: req.body.interest,
            details: req.body.details.replace(/(?:\r\n|\r|\n)/g, '<br/>').replace(/\s/g, '&nbsp;'),
            createdAt: (new Date()).toUTCString()
        });
        contactUs.save(function (err) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            var mailOptions = {
                from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                to: config.contactUsEmailList,
                subject: config.contactUsEmailSubject,
                html: sf(config.contactUsEmailBody, config.imageUrl, contactUs.name, contactUs.email, contactUs.telephone, contactUs.country, contactUs.interest, contactUs.details)
            };
            email.sendEmail(mailOptions, function (err) {
                if (err) {
                    logger.logError(err);
                }
            });
            return res.status(200).end();
        });
    },

    sendRafEmails: function (req, res) {
        Referrer.findOne({email: req.body.email.toLowerCase()}, function (err, referrer) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            if (!referrer) {
                referrer = new Referrer({
                    email: req.body.email,
                    createdAt: (new Date()).toUTCString()
                });
                referrer.save(function(err){
                    if (err) {
                        logger.logError(err);
                        return res.status(500).end();
                    }
                    referrer.referralCode = hashids.encode(referrer.key, 5);
                    referrer.save(function(err){
                        if (err) {
                            logger.logError(err);
                            return res.status(500).end();
                        }
                        sendEmail();
                    });
                });
            } else {
                sendEmail();
            }

            function sendEmail() {
                var rafUrl = config.url + 'invite/' + referrer.referralCode;
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: req.body.emailList,
                    subject: config.referAFriendEmailSubject,
                    html: sf(config.referAFriendEmailBody, config.imageUrl, rafUrl)
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError(err);
                    }
                });
                return res.status(200).end();
            }
        });
    }
};
