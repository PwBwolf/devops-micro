'use strict';

var config = require('../setup/config'),
    logger = require('../../common/setup/logger'),
    Client = require('node-rest-client').Client;

module.exports = {
    createUser: function (username, externalId, displayName, password, email, pin, packages, callback) {
        var client = new Client();
        var args = {
            data: {username: username, externalId: externalId, displayName: displayName, password: password, email: email, pin: pin, packages: packages},
            headers: {'Content-Type': 'application/json', 'Authorization': 'apikey ' + config.aioApiKey},
            requestConfig: {timeout: 3000},
            responseConfig: {timeout: 3000}
        };
        client.post(config.aioApiUrl + '/ws/AddCustomer.php', args, function (data) {
            logger.logInfo('aio - createUser - response');
            var jsonData = JSON.parse(data);
            logger.logInfo(jsonData);
            if (jsonData.responseCode !== 0) {
                callback(jsonData.message);
            } else {
                callback(null, jsonData);
            }
        }).on('error', function (err) {
            logger.logError('aio - createUser - error in adding customer');
            logger.logError(err);
            callback(err);
        });
    },

    updateUserStatus: function (username, isActive, callback) {
        var client = new Client();
        var args = {
            data: {username: username, active: isActive},
            headers: {'Content-Type': 'application/json', 'Authorization': 'apikey ' + config.aioApiKey},
            requestConfig: {timeout: 3000},
            responseConfig: {timeout: 3000}
        };
        client.post(config.aioApiUrl + '/ws/UpdateCustomerStatus.php', args, function (data) {
            logger.logInfo('aio - updateUserStatus - response');
            var jsonData = JSON.parse(data);
            logger.logInfo(jsonData);
            if (jsonData.responseCode !== 0) {
                callback(jsonData.message);
            } else {
                callback(null, jsonData);
            }
        }).on('error', function (err) {
            logger.logError('aio - updateUserStatus - error in updating customer status');
            logger.logError(err);
            callback(err);
        });
    },

    updateUserPackages: function (username, packages, callback) {
        var client = new Client();
        var args = {
            data: {username: username, packages: packages},
            headers: {'Content-Type': 'application/json', 'Authorization': 'apikey ' + config.aioApiKey},
            requestConfig: {timeout: 3000},
            responseConfig: {timeout: 3000}
        };
        client.post(config.aioApiUrl + '/ws/UpdateCustomerPackages.php', args, function (data) {
            logger.logInfo('aio - updateUserPackages - response');
            var jsonData = JSON.parse(data);
            logger.logInfo(jsonData);
            if (jsonData.responseCode !== 0) {
                callback(jsonData.message);
            } else {
                callback(null, jsonData);
            }
        }).on('error', function (err) {
            logger.logError('aio - updateUserPackages - error in updating user packages');
            logger.logError(err);
            callback(err);
        });
    },

    updatePassword: function (username, password, callback) {
        var client = new Client();
        var args = {
            data: {username: username, password: password},
            headers: {'Content-Type': 'application/json', 'Authorization': 'apikey ' + config.aioApiKey},
            requestConfig: {timeout: 3000},
            responseConfig: {timeout: 3000}
        };
        client.post(config.aioApiUrl + '/ws/UpdateCustomer.php', args, function (data) {
            logger.logInfo('aio - updatePassword - response');
            var jsonData = JSON.parse(data);
            logger.logInfo(jsonData);
            if (jsonData.responseCode !== 0) {
                callback(jsonData.message);
            } else {
                callback(null, jsonData);
            }
        }).on('error', function (err) {
            logger.logError('aio - updatePassword - error in updating password');
            logger.logError(err);
            callback(err);
        });
    }
};
