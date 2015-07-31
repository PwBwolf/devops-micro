'use strict';

var config = require('../setup/config'),
    _ = require('lodash'),
    async = require('async'),
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

    newCustomer: function (firstName, lastName, address, city, state, zip, country, email, password, telephone, payBy, payInfo, payDate, payCvv, payName, locale, callback) {
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
                '_password', password,
                'locale', locale
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

    updateCustomer: function (sessionId, firstName, lastName, address, city, state, zip, country, email, telephone, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.edit_info',
            [
                'session_id', sessionId,
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
                'month', payDate.substring(0, 2),
                'year', payDate.substring(3),
                'paycvv', payCvv,
                'payname', payName,
                'auto', 'Y'
            ], function (err, response) {
                if (err) {
                    logger.logError('billing - updateCustomer - error in updating customer 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - updateCustomer - error in updating customer 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - updateCustomer - response');
                        logger.logInfo(response);
                        callback(null);
                    }
                }
            }
        );
    },

    updateBilling: function (sessionId, address, city, state, zip, country, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
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
                    logger.logError('billing - updateBilling - error in updating billing 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - updateBilling - error in updating billing 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - updateBilling - response');
                        logger.logInfo(response);
                        callback(null);
                    }
                }
            }
        );
    },

    updateAddress: function (sessionId, address, city, state, zip, country, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.edit_info',
            [
                'session_id', sessionId,
                'address1', address,
                'city', city,
                'county', '',
                'state', state,
                'zip', zip,
                'country', country
            ], function (err, response) {
                if (err) {
                    logger.logError('billing - updateAddress - error in updating address 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - updateAddress - error in creating address 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - updateAddress - response');
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

    cancelPackages: function (sessionId, packageParts, callback) {
        getPackages(sessionId, function (err, packages) {
            if (err) {
                logger.logError('billing - cancelPackages - error getting packages');
                logger.logError(err);
                callback(err);
            } else if (packages && packages.length > 0) {
                var packageNumbers = [];
                for (var i = 0; i < packageParts.length; i++) {
                    for (var j = 0; j < packages.length; j++) {
                        if (packages[j].pkgpart === String(packageParts[i])) {
                            packageNumbers.push(packages[j].pkgnum);
                            break;
                        }
                    }
                }
                if (packageNumbers.length > 0) {
                    async.eachSeries(
                        packageNumbers,
                        function (packageNumber, callback) {
                            cancelPackage(sessionId, packageNumber, function (err) {
                                if (err) {
                                    logger.logError('billing - cancelPackages - error removing packages');
                                }
                                callback(err);
                            });
                        },
                        function (err) {
                            callback(err);
                        }
                    );
                } else {
                    callback(null);
                }
            } else {
                callback(null);
            }
        });
    },

    getBillingDate: function (sessionId, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.renew_info', [
            'session_id', sessionId
        ], function (err, response) {
            if (err) {
                logger.logError('billing - getBillingDate - error in getting billing date 1');
                logger.logError(err);
                callback(err);
            } else {
                if (response.error) {
                    logger.logError('billing - getBillingDate - error in getting billing date 2');
                    logger.logError(response.error);
                    callback(response.error);
                } else if (response.dates && response.dates.length > 0) {
                    logger.logInfo('billing - getBillingDate - response');
                    logger.logInfo(response);
                    var index = _.findIndex(response.dates, {'amount': config.paidBasicPackageAmount});
                    if (index >= 0) {
                        callback(null, new Date(response.dates[index].bill_date * 1000));
                    } else {
                        callback(null, null);
                    }
                } else {
                    logger.logInfo('billing - getBillingDate - billing date not found');
                    callback(null, null);
                }
            }
        });
    },

    updateLocale: function (sessionId, locale, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.edit_info',
            [
                'session_id', sessionId,
                'locale', locale
            ], function (err, response) {
                if (err) {
                    logger.logError('billing - updateLocale - error in updating locale 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - updateLocale - error in updating locale 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - updateLocale - response');
                        logger.logInfo(response);
                        callback(null);
                    }
                }
            }
        );
    },

    changeEmail: function (sessionId, newEmail, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.edit_contact', [
            'session_id', sessionId,
            'emailaddress', newEmail
        ], function (err, response) {
            if (err) {
                logger.logError('billing - changeEmail - error in changing email address 1');
                logger.logError(err);
                callback(err);
            } else {
                if (response.error) {
                    logger.logError('billing - changeEmail - error in changing email address 2');
                    logger.logError(response.error);
                    callback(response.error);
                } else {
                    logger.logInfo('billing - changeEmail - response');
                    logger.logInfo(response);
                    callback(null);
                }
            }
        });
    },

    cancelPackage: cancelPackage,

    getPackages: getPackages
};

function cancelPackage(sessionId, packageNumber, callback) {
    var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
    client.methodCall('FS.ClientAPI_XMLRPC.cancel_pkg', [
        'session_id', sessionId,
        'pkgnum', packageNumber
    ], function (err, response) {
        if (err) {
            logger.logError('billing - cancelPackage - error in canceling package 1');
            logger.logError(err);
            if (callback) {
                callback(err);
            }
        } else {
            if (response.error) {
                logger.logError('billing - cancelPackage - error in canceling package 2');
                logger.logError(response.error);
                if (callback) {
                    callback(response.error);
                }
            } else {
                logger.logInfo('billing - cancelPackage - response');
                logger.logInfo(response);
                if (callback) {
                    callback(null);
                }
            }
        }
    });
}

function getPackages(sessionId, callback) {
    var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
    client.methodCall('FS.ClientAPI_XMLRPC.list_pkgs', [
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
}
