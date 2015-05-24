'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    ContactUs = mongoose.model('ContactUs'),
    Referrer = mongoose.model('Referrer'),
    Visitor = mongoose.model('Visitor'),
    Country = mongoose.model('Country'),
    State = mongoose.model('State'),
    AppConfig = mongoose.model('AppConfig'),
    Version = mongoose.model('Version'),
    WebSlider = mongoose.model('WebSlider'),
    ComplimentaryCode = mongoose.model('ComplimentaryCode'),
    Hashids = require('hashids'),
    hashids = new Hashids(config.secretToken, 5),
    email = require('../../common/services/email'),
    date = require('../../common/services/date'),
    sf = require('sf');

module.exports = {
    getAppConfig: function (req, res) {
        AppConfig.findOne({}, {_id: false}, function (err, appConfig) {
            if (err) {
                logger.logError('appController - getAppConfig - error fetching app config');
                logger.logError(err);
                return res.status(500).end();
            }
            Version.findOne({}, {_id: false}, function (err, version) {
                if (err) {
                    logger.logError('appController - getAppConfig - error fetching versions');
                    logger.logError(err);
                    return res.status(500).end();
                }
                var props = {
                    environment: process.env.NODE_ENV,
                    url: config.url,
                    aioPortalUrl: config.aioPortalUrl,
                    freePreviewTime: config.freePreviewTime,
                    webSliderVersion: version.webSliderVersion,
                    graceNoteImageUrl: config.graceNoteImageUrl
                };
                appConfig = _.assign(appConfig._doc, props);
                return res.json(appConfig);
            });
        });
    },

    getWebSliders: function (req, res) {
        WebSlider.find({}, {_id: false}, {sort: {order: 1}}, function (err, sliders) {
            if (err) {
                logger.logError('appController - getWebSlider - error fetching web sliders');
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(sliders);
        });
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
    },

    saveVisitor: function (req, res) {
        Visitor.findOne({email: req.body.email.toLowerCase()}, function (err, visitor) {
            if (err) {
                logger.logError('appController - saveVisitor - error fetching visitor: ' + req.body.email.toLowerCase());
                logger.logError(err);
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
                        logger.logError('appController - saveVisitor - error saving visitor - 1: ' + req.body.email.toLowerCase());
                        logger.logError(err);
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
                            logger.logError('appController - saveVisitor - error saving visitor - 2: ' + req.body.email.toLowerCase());
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
                logger.logError('appController - saveContactUs - error saving contact us: ' + req.body.email);
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
                    logger.logError('appController - saveContactUs - error sending contact us email: ' + req.body.email);
                    logger.logError(err);
                } else {
                    logger.logInfo('appController - saveContactUs - contact us email sent to ' + mailOptions.to);
                }
            });
            return res.status(200).end();
        });
    },

    sendRafEmails: function (req, res) {
        Referrer.findOne({email: req.body.email.toLowerCase()}, function (err, referrer) {
            if (err) {
                logger.logError('appController - sendRafEmails - error fetching referrer: ' + req.body.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!referrer) {
                referrer = new Referrer({
                    email: req.body.email,
                    createdAt: (new Date()).toUTCString()
                });
                referrer.save(function (err) {
                    if (err) {
                        logger.logError('appController - sendRafEmails - error saving referrer: ' + req.body.email.toLowerCase());
                        logger.logError(err);
                        return res.status(500).end();
                    }
                    referrer.referralCode = hashids.encode(referrer.key, 5);
                    referrer.save(function (err) {
                        if (err) {
                            logger.logError('appController - sendRafEmails - error saving referrer after referralCode: ' + req.body.email.toLowerCase());
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
                    bcc: req.body.emailList,
                    subject: config.referAFriendEmailSubject,
                    html: sf(config.referAFriendEmailBody, config.imageUrl, rafUrl)
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError('appController - sendRafEmails.sendEmail - error sending RAF email to ' + mailOptions.to);
                        logger.logError(err);
                    } else {
                        logger.logInfo('appController - sendRafEmails.sendEmail - refer a friend email sent to ' + mailOptions.to);
                    }
                });
                return res.status(200).end();
            }
        });
    },

    checkComplimentaryCode: function (req, res) {
        ComplimentaryCode.findOne({code: req.query.code}, function (err, cc) {
            if (err) {
                logger.logError('appController - checkComplimentaryCode - error fetching complimentary code: ' + req.query.code);
                logger.logError(err);
                return res.status(500).end();
            }
            if (!cc) {
                return res.status(404).send('CodeNotFound');
            }
            if (cc.disabled) {
                return res.status(409).send('CodeDisabled');
            }
            if (cc.maximumAccounts <= cc.accountCount) {
                return res.status(409).send('CodeMaxedOut');
            }
            var now = date.utcDateTime(new Date());
            if (cc.startDate > now || cc.endDate < now) {
                return res.status(409).send('CodeTimedOut');
            }
            return res.status(200).end();
        });
    }
};
