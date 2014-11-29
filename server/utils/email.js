'use strict';

var mailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    config = require('../config/config');

var transporter = mailer.createTransport(smtpTransport({
        host: config.email.host,
        port: config.email.port,
        auth: {
            user: config.email.user,
            pass: config.email.password
        },
        secure:false,
        tls: {
            ciphers:'SSLv3'
        }
    })
);

exports.sendEmail = function(mailOptions, callback) {
    transporter.sendMail(mailOptions, callback);
};
