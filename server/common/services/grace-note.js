'use strict';

var config = require('../setup/config'),
    logger = require('../../common/setup/logger'),
    Client = require('node-rest-client').Client;

module.exports = {

    getChannelGuide: function (stationId, startTime, endTime, callback) {
        var client = new Client();
        var args = {
            parameters: {
                stationId: stationId,
                startDateTime: startTime,
                endDateTime: endTime,
                api_key: config.graceNoteApiKey
            },
            requestConfig: {timeout: 3000},
            responseConfig: {timeout: 3000}
        };
        client.get(config.graceNoteApiUrl + '/lineups/' + config.graceNoteLineupId + '/grid', args, function (data) {
            logger.logInfo('graceNote - getChannelGuide - response');
            if (data.errorCode) {
                callback(data.errorMessage);
            } else {
                callback(null, data);
            }
        }).on('error', function (err) {
            logger.logError('graceNote - getChannelGuide - error in getting channel guide');
            logger.logError(err);
            callback(err);
        });
    },

    getChannelList: function (callback) {
        var client = new Client();
        var args = {
            parameters: {
                api_key: config.graceNoteApiKey
            },
            requestConfig: {timeout: 3000},
            responseConfig: {timeout: 3000}
        };
        client.get(config.graceNoteApiUrl + '/lineups/' + config.graceNoteLineupId + '/channels', args, function (data) {
            logger.logInfo('graceNote - getChannelList - response');
            logger.logInfo(data);
            if (data.errorCode) {
                callback(data.errorMessage);
            } else {
                callback(null, data);
            }
        }).on('error', function (err) {
            logger.logError('graceNote - getChannelList - error in getting channel list');
            logger.logError(err);
            callback(err);
        });
    }
};
