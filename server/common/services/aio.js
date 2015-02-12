'use strict';

var config = require('../config/config'),
    logger = require('../../common/config/logger'),
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
            logger.logInfo(data);
            var jsonData = JSON.parse(data);
            if (jsonData.responseCode !== 0) {
                callback(jsonData.message);
            } else {
                callback(null, jsonData);
            }
        }).on('error', function (err) {
            logger.logError(JSON.stringify(err));
            callback(err);
        });
    },

    getToken: function (username, callback) {
        var client = new Client();
        var args = {
            parameters: {back_office: true, username: username},
            headers: {'Authorization': 'apikey ' + config.aioApiKey},
            requestConfig: {timeout: 3000},
            responseConfig: {timeout: 3000}
        };
        client.get(config.aioApiUrl + '/api/auth/token/sso/', args, function (data) {
            logger.logInfo(data);
            if (data.success !== 'true') {
                callback(data.detail);
            } else {
                callback(null, data);
            }
        }).on('error', function (err) {
            logger.logError(JSON.stringify(err));
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
            logger.logInfo(data);
            var jsonData = JSON.parse(data);
            if (jsonData.responseCode !== 0) {
                callback(jsonData.message);
            } else {
                callback(null, jsonData);
            }
        }).on('error', function (err) {
            logger.logError(JSON.stringify(err));
            callback(err);
        });
    },

    updateUserPackages: function(username, packages, callback) {
        var client = new Client();
        var args = {
            data: {username: username, packages: packages},
            headers: {'Content-Type': 'application/json', 'Authorization': 'apikey ' + config.aioApiKey},
            requestConfig: {timeout: 3000},
            responseConfig: {timeout: 3000}
        };
        client.post(config.aioApiUrl + '/ws/UpdateCustomerPackages.php', args, function (data) {
            logger.logInfo(data);
            var jsonData = JSON.parse(data);
            if (jsonData.responseCode !== 0) {
                callback(jsonData.message);
            } else {
                callback(null, jsonData);
            }
        }).on('error', function (err) {
            logger.logError(JSON.stringify(err));
            callback(err);
        });
    }
};
