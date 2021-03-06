'use strict';

var config = require('../setup/config'),
    _ = require('lodash'),
    async = require('async'),
    logger = require('../../common/setup/logger'),
    validation = require('../../common/services/validation'),
    xmlrpc = require('xmlrpc');

module.exports = {

    login: function (email, key, password, callback) {
        var username = validation.isUsPhoneNumberInternationalFormat(email) ? getFreeSideKey(email, key) : email;
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.login', [
            'email', username,
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

    newCustomer: function (firstName, lastName, address, city, state, zip, country, email, key, password, payBy, payInfo, payDate, payCvv, payName, locale, agentNumber, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        var dayTime, invoicingList, emailKey;
        if (validation.isUsPhoneNumberInternationalFormat(email)) {
            dayTime = email.substr(1);
            invoicingList = getFreeSideKey(email, key);
            emailKey = getFreeSideKey(email, key);
        } else {
            dayTime = '';
            invoicingList = email;
            emailKey = email;
        }
        client.methodCall('FS.ClientAPI_XMLRPC.new_customer_minimal',
            [
                'agentnum', agentNumber ? agentNumber : 1,
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
                'daytime', dayTime,
                'invoicing_list', invoicingList,
                'postal_invoicing', 0,
                'payby', payBy,
                'payinfo', payInfo,
                'paydate', payDate,
                'paycvv', payCvv,
                'payname', payName,
                'username', emailKey,
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

    updateCustomer: function (sessionId, firstName, lastName, address, city, state, zip, country, email, key, locale, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        var dayTime, invoicingList;
        if (validation.isUsPhoneNumberInternationalFormat(email)) {
            dayTime = email.substr(1);
            invoicingList = getFreeSideKey(email, key);
        } else {
            dayTime = '';
            invoicingList = email;
        }
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
                'daytime', dayTime,
                'invoicing_list', invoicingList,
                'locale', locale,
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

    updateInfo: function (sessionId, firstName, lastName, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.edit_info',
            [
                'session_id', sessionId,
                'first', firstName,
                'last', lastName
            ], function (err, response) {
                if (err) {
                    logger.logError('billing - updateInfo - error in updating customer 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - updateInfo - error in updating customer 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - updateInfo - response');
                        logger.logInfo(response);
                        callback(null);
                    }
                }
            }
        );
    },

    updateBilling: function (sessionId, address, city, state, zip, country, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        try {
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
        } catch (ex) {
            logger.logError(ex);
        }
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

    updateBillingType: function (sessionId, payBy, payInfo, payDate, payCvv, payName, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.edit_info',
            [
                'session_id', sessionId,
                'payby', payBy,
                'payinfo', payInfo,
                'paycvv', payCvv,
                'month', payDate ? payDate.substring(0, 2) : '12',
                'year', payDate ? payDate.substring(3) : '2099',
                'payname', payName
            ], function (err, response) {
                if (err) {
                    logger.logError('billing - updateBillingType - error in updating billing type 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - updateBillingType - error in creating billing type 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - updateBillingType - response');
                        logger.logInfo(response);
                        callback(null);
                    }
                }
            }
        );
    },

    orderPackage: orderPackage,

    checkAndOrderPackage: function (sessionId, packagePart, callback) {
        getPackages(sessionId, function (err, packages) {
            if (err) {
                logger.logError('billing - checkAndOrderPackage - error getting packages');
                logger.logError(err);
                callback(err);
            } else if (packages && packages.length > 0 && _.findIndex(packages, {'pkgpart': packagePart.toString()}) > -1) {
                logger.logInfo('billing - checkAndOrderPackage - package exists not added again');
                callback(null);
            } else {
                orderPackage(sessionId, packagePart, function (err) {
                    if (err) {
                        logger.logError('billing - checkAndOrderPackage - error ordering package');
                        logger.logError(err);
                    }
                    callback(err);
                });
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

    cancelPackagesOn: function (sessionId, packageParts, cancelDate, callback) {
        getPackages(sessionId, function (err, packages) {
            if (err) {
                logger.logError('billing - cancelPackagesOn - error getting packages');
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
                            cancelPackageOn(sessionId, packageNumber, cancelDate, function (err) {
                                if (err) {
                                    logger.logError('billing - cancelPackagesOn - error removing packages');
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
        getPackages(sessionId, function (err, packages) {
            if (err) {
                logger.logError('billing - getBillingDate - error getting packages');
                logger.logError(err);
                callback(err);
            } else if (packages && packages.length > 0) {
                var index = _.findIndex(packages, {'pkgpart': config.freeSidePaidBasicPackagePart.toString()});
                if (index >= 0) {
                    callback(null, new Date(packages[index].bill * 1000));
                } else {
                    callback(null, null);
                }
            } else {
                callback(null, null);
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

    getAgent: function(sessionId, callback) {
        var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
        client.methodCall('FS.ClientAPI_XMLRPC.skin_info',
            [
                'session_id', sessionId
            ], function (err, response) {
                if (err) {
                    logger.logError('billing - getAgent - error in getting agent 1');
                    logger.logError(err);
                    callback(err);
                } else {
                    if (response.error) {
                        logger.logError('billing - getAgent - error in getting agent 2');
                        logger.logError(response.error);
                        callback(response.error);
                    } else {
                        logger.logInfo('billing - getAgent - response');
                        logger.logInfo(response);
                        callback(null, response.agentnum);
                    }
                }
            }
        );
    },

    updateAgent: function (customerNumber, agentNumber, callback) {
        var client = xmlrpc.createClient(config.freeSideBackOfficeApiUrl);
        client.methodCall('FS.API.update_customer', [
            'secret', config.freeSideSecretKey,
            'custnum', customerNumber,
            'agentnum', agentNumber ? agentNumber : 1
        ], function (err, response) {
            if (err) {
                logger.logError('billing - updateAgent - error in updating agent number 1');
                logger.logError(err);
                if (callback) {
                    callback(err);
                }
            } else {
                if (response.error) {
                    logger.logError('billing - updateAgent - error in updating agent number 2');
                    logger.logError(response.error);
                    if (callback) {
                        callback(response.error);
                    }
                } else {
                    logger.logInfo('billing - updateAgent - response');
                    logger.logInfo(response);
                    if (callback) {
                        callback(null);
                    }
                }
            }
        });
    },

    makePayment: function (customerNumber, amount, payBy, orderNumber, callback) {
        var client = xmlrpc.createClient(config.freeSideBackOfficeApiUrl);
        client.methodCall('FS.API.insert_payment', [
            'secret', config.freeSideSecretKey,
            'custnum', customerNumber,
            'payby', payBy,
            'paid', amount,
            '_date', Math.round(new Date().getTime() / 1000),
            'order_number', orderNumber
        ], function (err, response) {
            if (err) {
                logger.logError('billing - makePayment - error in inserting payment 1');
                logger.logError(err);
                if (callback) {
                    callback(err);
                }
            } else {
                if (response.error) {
                    logger.logError('billing - makePayment - error in inserting payment 2');
                    logger.logError(response.error);
                    if (callback) {
                        callback(response.error);
                    }
                } else {
                    logger.logInfo('billing - makePayment - response');
                    logger.logInfo(response);
                    if (callback) {
                        callback(null);
                    }
                }
            }
        });
    },

    makeRefund: function (customerNumber, amount, payBy, callback) {
        var client = xmlrpc.createClient(config.freeSideBackOfficeApiUrl);
        client.methodCall('FS.API.insert_refund', [
            'secret', config.freeSideSecretKey,
            'custnum', customerNumber,
            'payby', payBy,
            'paid', amount,
            '_date', Math.round(new Date().getTime() / 1000)
        ], function (err, response) {
            if (err) {
                logger.logError('billing - makePayment - error in insertint payment 1');
                logger.logError(err);
                if (callback) {
                    callback(err);
                }
            } else {
                if (response.error) {
                    logger.logError('billing - makePayment - error in inserting payment 2');
                    logger.logError(response.error);
                    if (callback) {
                        callback(response.error);
                    }
                } else {
                    logger.logInfo('billing - makePayment - response');
                    logger.logInfo(response);
                    if (callback) {
                        callback(null);
                    }
                }
            }
        });
    },

    cancelPackage: cancelPackage,

    cancelPackageOn: cancelPackageOn,

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

function cancelPackageOn(sessionId, packageNumber, cancelDate, callback) {
    var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
    client.methodCall('FS.ClientAPI_XMLRPC.cancel_pkg', [
        'session_id', sessionId,
        'pkgnum', packageNumber,
        'date', cancelDate.getTime() / 1000
    ], function (err, response) {
        if (err) {
            logger.logError('billing - cancelPackageOn - error in canceling package 1');
            logger.logError(err);
            if (callback) {
                callback(err);
            }
        } else {
            if (response.error) {
                logger.logError('billing - cancelPackageOn - error in canceling package 2');
                logger.logError(response.error);
                if (callback) {
                    callback(response.error);
                }
            } else {
                logger.logInfo('billing - cancelPackageOn - response');
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

function orderPackage(sessionId, packagePart, callback) {
    var client = xmlrpc.createClient(config.freeSideSelfServiceApiUrl);
    client.methodCall('FS.ClientAPI_XMLRPC.order_pkg', [
        'session_id', sessionId,
        'pkgpart', packagePart,
        'quantity', 1,
        'svcpart', 'none',
        'run_bill_events', true
    ], function (err, response) {
        if (err) {
            logger.logError('billing - orderPackage - error in ordering package 1');
            logger.logError(err);
            callback(err);
        } else {
            if (response.error) {
                logger.logError('billing - orderPackage - error in ordering package 2');
                logger.logError(response.bill_error);
                logger.logError(response.error);
                callback(response.error);
            } else {
                logger.logInfo('billing - orderPackage - response');
                logger.logInfo(response);
                callback(null);
            }
        }
    });
}

function getFreeSideKey(email, key) {
    return email + '_' + key + '@' + config.freeSideKeyEmailDomain;
}
