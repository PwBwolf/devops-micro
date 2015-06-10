'use strict';

var config = require('../setup/config'),
    logger = require('../../common/setup/logger'),
    xmlrpc = require('xmlrpc');

module.exports = {

    login: function (email, password, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.login', [
            'email', email,
            'password', password,
            'domain', 'yiptv.com'
        ], function (error, response) {
            if (error) {
                logger.logError('billing - login - error in login 1');
                logger.logError(error);
                callback(error);
            } else {
                if (response.error) {
                    logger.logError('billing - login - error in login 2');
                    logger.logError(response.error);
                    callback(response.error);
                } else {
                    logger.logInfo('billing - login - response');
                    logger.logInfo(response);
                    callback(null, response.session_id);
                }
            }
        });
    },

    newCustomer: function (firstName, lastName, address, city, state, zip, country, email, password, telephone, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.new_customer_minimal',
            [
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
                'payname', payName,
                'username', email,
                '_password', password
            ], function (err, response) {
                if (err) {
                    logger.logError('billing - createCustomer - error in creating customer 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - createCustomer - error in creating customer 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - createCustomer - response');
                        logger.logInfo(response);
                        callback(null, response.custnum, response.session_id);
                    }
                }
            }
        );
    },

    updateCreditCard: function (customerNumber, address, city, state, zip, country, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideBackOfficeApiUrl);
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

    updateCreditCardNew: function (sessionId, address, city, state, zip, country, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        console.log(payDate);
        client.methodCall('FS.ClientAPI_XMLRPC.edit_info',
            [
                'session_id', sessionId,
                'address1', address,
                'city', city,
                'county', '',
                'state', state,
                'zip', zip,
                'country', country,
                'payby', payBy,
                'payinfo', payInfo,
                'paycvv', payCvv,
                'month', payDate.substring(0, 2),
                'year', payDate.substring(3),
                'auto', 'Y',
                'payname', payName
            ], function (err, response) {
                if (err) {
                    logger.logError('billing - updateCreditCard - error in creating customer 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - updateCreditCard - error in creating customer 2');
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

    orderPackage: function (sessionId, packagePart, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.order_pkg', [
            'session_id', sessionId,
            'pkgpart', packagePart,
            'quantity', 1,
            'svcpart', 'none'
        ], function (err, response) {
            if (err) {
                logger.logError('billing - orderPackage - error in ordering package 1');
                logger.logError(err);
                callback(err);
            } else {
                if (response.error) {
                    logger.logError('billing - orderPackage - error in ordering package 2');
                    logger.logError(response.error);
                    callback(response.error);
                } else {
                    logger.logInfo('billing - orderPackage - response');
                    logger.logInfo(response);
                    callback(null);
                }
            }
        });
    },

    getPackages: function(sessionId, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.order_pkg', [
            'session_id', sessionId
        ], function (err, response) {
            if (err) {
                logger.logError('billing - getPackages - error in getting packages 1');
                logger.logError(err);
                callback(err);
            } else {
                if (response.error) {
                    logger.logError('billing - getPackages - error in getting packages 2');
                    logger.logError(response.error);
                    callback(response.error);
                } else {
                    logger.logInfo('billing - getPackages - response');
                    logger.logInfo(response);
                    callback(null, response.cust_pkg);
                }
            }
        });
    },

    updateUser: function (customerNumber, firstName, lastName, address, city, state, zip, country, email, telephone, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideBackOfficeApiUrl);
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

    setAccountCanceled: function (customerNumber, address, city, state, country, zip, callback) {
        var client = xmlrpc.createClient(config.freeSideBackOfficeApiUrl);
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

    setTrialEnded: function (customerNumber, address, city, state, country, zip, callback) {
        var client = xmlrpc.createClient(config.freeSideBackOfficeApiUrl);
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

    setComplimentaryEnded: function (customerNumber, address, city, state, country, zip, expiryDate, callback) {
        var client = xmlrpc.createClient(config.freeSideBackOfficeApiUrl);
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
