'use strict';

var mongoose = require('mongoose'),
    logger = require('../config/logger'),
    AppConfig = mongoose.model('AppConfig');

//mongoose.connect(config.db);

module.exports = {
    getAppConfig: function (req, res) {
        //return res.json({ appName: 'YipTV', customerCareNumber: '855-123-1234'});
        var query = AppConfig.find().exec();
        query.then(function (config) {
            console.dir(config);
            return res.json(config);
        }, function(error){
            console.dir(error);
            logger.error(error);
            return res.send(500);
        });
    }
};
