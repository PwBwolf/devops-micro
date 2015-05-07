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
                    logger.logError('billing - createUser - error in creating customer 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - createUser - error in creating customer 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - createUser - response');
                        logger.logInfo(response);
                        callback(null, response.custnum);
                    }
                }
            }
        );
    },

    updateUser: function (customerNumber, firstName, lastName, address, city, state, zip, country, email, telephone, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideUrl);
        client.methodCall('FS.API.update_customer',
            [
                'secret', config.freeSideApiKey,
                'custnum', customerNumber,
                'first', firstName,
                'last', lastName,
                'address1', address,
                'city', city,
                'county', '',
                'state', state,
                'zip', zip,
                'country', country,
                'daytime', telephone,
                'invoicing_list', email,
                'payby', payBy,
                'payinfo', payInfo,
                'paydate', payDate,
                'paycvv', payCvv,
                'payname', payName
            ], function (err, response) {
                if (err) {
                    logger.logError('billing - updateUser - error in updating customer 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - updateUser - error in updating customer 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - updateUser - response');
                        logger.logInfo(response);
                        callback(null);
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
                    logger.logError('billing - updateCreditCard - error in updating customer 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - updateCreditCard - error in updating customer 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - updateCreditCard - response');
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
                'payby', 'CARD',
                'payinfo', '4242424242424242',
                'paydate', '12/2035',
                'paycvv', '123',
            ], function (err, response) {
                if (err) {
                    logger.logError('billing - setAccountCanceled - error in updating customer 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - setAccountCanceled - error in updating customer 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - setAccountCanceled - response');
                        logger.logInfo(response);
                        callback(null);
                    }
                }
            }
        );
    },

    setTrialEnded: function(customerNumber, address, city, state, country, zip, callback) {
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
                    logger.logError('billing - setTrialEnded - error in updating customer 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - setTrialEnded - error in updating customer 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - setTrialEnded - response');
                        logger.logInfo(response);
                        callback(null);
                    }
                }
            }
        );
    },

    setComplimentaryEnded: function(customerNumber, address, city, state, country, zip, expiryDate, callback) {
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
                'paydate', expiryDate
            ], function (err, response) {
                if (err) {
                    logger.logError('billing - setComplimentaryEnded - error in updating customer 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - setComplimentaryEnded - error in updating customer 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - setComplimentaryEnded - response');
                        logger.logInfo(response);
                        callback(null);
                    }
                }
            }
        );
    }
};
