'use strict';

var mongoose = require('mongoose'),
    logger = require('../config/logger'),
    AppConfig = mongoose.model('AppConfig');

module.exports = {
    getAppConfig: function (req, res) {
        return res.json({ appName: 'YipTV', customerCareNumber: '855-123-1234'});
        /*var query = AppConfig.findOne({}).exec();
        query.then(function (config) {
            return res.json(config);
        }).error(function(error){
            logger.error(error);
            return res.send(500);
        });*/
    }
};
