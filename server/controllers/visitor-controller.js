'use strict';

var mongoose = require('mongoose'),
    logger = require('../config/logger'),
    Visitor = mongoose.model('Visitor');

module.exports = {
    saveVisitor: function (req, res) {
        //return res.json({ appName: 'YipTV', customerCareNumber: '855-123-1234'});
        Visitor.findOne({ email: req.email }).exec().then(function (visitor) {
            if(!visitor) {
                var visitorObj = new Visitor({ email: req.email, firstName: req.firstName, lastName: req.LastName });
                visitorObj.save().exec().then(function() {
                    return res.send(200);
                }, function(error) {
                    logger.error(error);
                    return res.send(500);
                });
            }
        }, function(error){
            logger.error(error);
            return res.send(500);
        });
    }
};
