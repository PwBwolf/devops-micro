'use strict';

var config = require('../config/config'),
    logger = require('../../common/config/logger'),
    xmlrpc = require('xmlrpc');

module.exports = {
    createUser: function (firstName, lastName, address, city, state, zip, country, email, telephone, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideUrl);
        client.methodCall('FS.API.new_customer',
            [
                'secret', config.freeSideApiKey,
                'agentnum', 1,
                'refnum', 1,
                'first', firstName,
                'last', lastName,
                'company', '',
                'address1', address,
                'city', city,
                'county', '',
                'state', state,
                'zip', zip,
                'country', country,
                'daytime', telephone,
                'invoicing_list', email,
                'postal_invoicing', 0,
                'payby', payBy,
                'payinfo', payInfo,
                'paydate', payDate,
                'paycvv', payCvv,
                'payname', payName
            ], function (err, response) {
                if (err) {
                    logger.logError(JSON.stringify(err));
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo(response);
                        callback(null, response.custnum);
                    }
                }
            }
        );
    },

    updateCreditCard: function (customerNumber, address, city, state, zip, country, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideUrl);
        client.methodCall('FS.API.update_customer',
            [
                'secret', config.freeSideApiKey,
                'custnum', customerNumber,
                'address1', address,
                'city', city,
                'county', '',
                'state', state,
                'zip', zip,
                'country', country,
                'payby', payBy,
                'payinfo', payInfo,
                'paydate', payDate,
                'paycvv', payCvv,
                'payname', payName
            ], function (err, response) {
                if (err) {
                    logger.logError(JSON.stringify(err));
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo(response);
                        callback(null);
                    }
                }
            }
        );
    },

    setAccountCanceled: function(customerNumber, address, city, state, country, zip, callback) {
        var client = xmlrpc.createClient(config.freeSideUrl);
        client.methodCall('FS.API.update_customer',
            [
                'secret', config.freeSideApiKey,
                'custnum', customerNumber,
                'address1', address,
                'city', city,
                'county', '',
                'state', state,
                'zip', zip,
                'country', country,
                'payinfo', '4242424242424242',
                'paydate', '12/2035',
                'paycvv', '123',
            ], function (err, response) {
                if (err) {
                    logger.logError(JSON.stringify(err));
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo(response);
                        callback(null);
                    }
                }
            }
        );
    },

    setTrialOrComplimentaryEnded: function(customerNumber, address, city, state, country, zip, callback) {
        var client = xmlrpc.createClient(config.freeSideUrl);
        client.methodCall('FS.API.update_customer',
            [
                'secret', config.freeSideApiKey,
                'custnum', customerNumber,
                'address1', address,
                'city', city,
                'county', '',
                'state', state,
                'zip', zip,
                'country', country
            ], function (err, response) {
                if (err) {
                    logger.logError(JSON.stringify(err));
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo(response);
                        callback(null);
                    }
                }
            }
        );
    }
};
