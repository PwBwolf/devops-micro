'use strict';

var config = require('../../common/setup/config'),
    async = require('../../node_modules/async'),
    logger = require('../../common/setup/logger'),
    xmlrpc = require('../../node_modules/xmlrpc');

module.exports = {

    updateFreeSideAgent: function (customerNumber, callback) {
        var client = xmlrpc.createClient(config.freeSideBackOfficeApiUri);
        client.methodCall('FS.API.update_customer', [
            'secret', config.freeSideSecret,
            'custnum', customerNumber,
            'agentnum', 2
        ], function (err, response) {
            if (err) {
                logger.logError('billing_backoffice - updateFreeSideAgent - error in updating agent number 1');
                logger.logError(err);
                if (callback) {
                    callback(err);
                }
            } else {
                if (response.error) {
                    logger.logError('billing_backoffice - updateFreeSideAgent - error in updating agent number 2');
                    logger.logError(response.error);
                    if (callback) {
                        callback(response.error);
                    }
                } else {
                    logger.logInfo('billing_backoffice - updateFreeSideAgent - response');
                    logger.logInfo(response);
                    if (callback) {
                        callback(null);
                    }
                }
            }
        });
    },

    takePaymentFreeSideAgent: function (customerNumber, paidAmt, callback) {
        var client = xmlrpc.createClient(config.freeSideBackOfficeApiUri);
        client.methodCall('FS.API.insert_payment', [
            'secret', config.freeSideSecret,
            'custnum', customerNumber,
            'payby', 'IDTP',
            'paid',  paidAmt,
            '_date', Math.round(new Date().getTime()/1000)
        ], function (err, response) {
            if (err) {
                logger.logError('billing_backoffice - takePaymentFreeSideAgent - error in insertint payment 1');
                logger.logError(err);
                if (callback) {
                    callback(err);
                }
            } else {
                if (response.error) {
                    logger.logError('billing_backoffice - takePaymentFreeSideAgent - error in inserting payment 2');
                    logger.logError(response.error);
                    if (callback) {
                        callback(response.error);
                    }
                } else {
                    logger.logInfo('billing_backoffice - takePaymentFreeSideAgent - response');
                    logger.logInfo(response);
                    if (callback) {
                        callback(null);
                    }
                }
            }
        });
    }
};

