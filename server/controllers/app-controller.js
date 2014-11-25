'use strict';

var mongoose = require('mongoose'),
    logger = require('../config/logger'),
    AppConfig = mongoose.model('AppConfig');

module.exports = {
    getAppConfig: function (req, res) {
        AppConfig.findOne({}, { _id: 0}).exec().then(function (config) {
            return res.json(config);
        }, function(error){
            logger.error(error);
            return res.send(500);
        });
    }
};
