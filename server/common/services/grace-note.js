'use strict';

var config = require('../config/config'),
    logger = require('../../common/config/logger'),
    Client = require('node-rest-client').Client;

module.exports = {

    getChannelGuide: function (stationId, startTime, endTime, callback) {
        console.log(stationId + " " + startTime + " " + endTime + " " + config.graceNoteApiKey + " " + config.graceNoteLineupId);
        var client = new Client();
        var args = {
            parameters: {stationId: stationId, startDateTime: startTime, endDateTime: endTime, api_key: config.graceNoteApiKey},
            requestConfig: {timeout: 3000},
            responseConfig: {timeout: 3000}
        };
        client.get(config.graceNoteApiUrl + '/lineups/' + config.graceNoteLineupId + '/grid', args, function (data) {
            logger.logInfo(data);
            if (data.errorCode) {
                callback(data.errorMessage);
            } else {
                callback(null, data);
            }
        }).on('error', function (err) {
            logger.logError(JSON.stringify(err));
            callback(err);
        });
    }
};
