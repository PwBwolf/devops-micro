'use strict';

var mongoose = require('mongoose'),
    logger = require('../config/logger'),
    AppConfig = mongoose.model('AppConfig');

module.exports = {
    getAppConfig: function (req, res) {
        AppConfig.findOne({}, { _id: 0}, function (err, config) {
            if(err) {
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(config);
        });
    }
};
