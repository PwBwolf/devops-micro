'use strict';

var config = require('../../common/setup/config'),
    logger = require('../../common/setup/logger'),
    Client = require('../../node_modules/node-rest-client').Client;

var graceNoteLineupId = 'USA-FL70393-DEFAULT';
var graceNoteApiUrl = 'http://data.tmsapi.com/v1.1';
var graceNoteApiKey = 'afcqtd2rkgbrw4u4hyg7uuz3';

module.exports = {

    getChannelGuide: function (stationId, startTime, endTime, callback) {
        var client = new Client();
        var args = {
            parameters: {
                stationId: stationId,
                startDateTime: startTime,
                endDateTime: endTime,
                api_key: graceNoteApiKey
            },
            requestConfig: {timeout: 5000},
            responseConfig: {timeout: 5000}
        };
        client.get(graceNoteApiUrl + '/lineups/' + graceNoteLineupId + '/grid', args, function (data) {
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
    }
};
