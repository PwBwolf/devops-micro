'use strict';

var mongoose = require('mongoose'),
    logger = require('../config/logger'),
    email = require('../utils/email'),
    config = require('../config/config'),
    sf = require('sf'),
    ContactUs = mongoose.model('ContactUs');

module.exports = {
    saveContactUs: function (req, res) {
        var contactUs = new ContactUs({
            name: req.body.name,
            email: req.body.email,
            telephone: req.body.telephone,
            ymId: req.body.ymId,
            skypeId: req.body.skypeId,
            country: req.body.country,
            interest: req.body.interest,
            details: req.body.details,
            createdAt: (new Date()).toUTCString()
        });
        contactUs.save(function(err){
            if(err) {
                logger.logError(err);
                return res.status(500).end();
            }
            var mailOptions = {
                from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                to: config.contactUsEmailList,
                subject: config.contactUsEmailSubject,
                html: sf(config.contactUsEmailBody, config.imageUrl, contactUs.name, contactUs.email, contactUs.telephone, contactUs.ymId, contactUs.skypeId, contactUs.country, contactUs.interest, contactUs.details)
            };
            email.sendEmail(mailOptions, function (err) {
                if (err) {
                    logger.logError(err);
                }
            });
            return res.status(200).end();
        });
    }
};
