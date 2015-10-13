'use strict';

var config = require('../setup/config'),
    logger = require('../../common/setup/logger'),
    client = require('restler');

module.exports = {
    getChannels: function (userType, callback) {
        var route = '/index.php?json_route=/channels';
        var type = '&user_type=' + userType;
        var url = config.cmsApiUrl + route + type;
        console.log(url);
        client.get(url).on('complete', function(result) {
            if (result instanceof Error) {
                logger.logError('cms - getChannels - error');
                logger.logError(result.message);
                callback(result.message);
            } else {
                logger.logInfo('cms - getChannels - response');
                logger.logInfo(result);
                callback(null, result);
            }
        });
    },

    getAds: function (callback) {
        var route = '/index.php?json_route=/ads';
        var url = config.cmsApiUrl + route;
        client.get(url).on('complete', function(result) {
            if (result instanceof Error) {
                logger.logError('cms - getAds - error');
                logger.logError(result.message);
                callback(result.message);
            } else {
                logger.logInfo('cms - getAds - response');
                logger.logInfo(result);
                callback(null, result);
            }
        });
    },

    getTags: function (callback) {
        var route = '/index.php?json_route=/tags';
        var url = config.cmsApiUrl + route;
        client.get(url).on('complete', function(result) {
            if (result instanceof Error) {
                logger.logError('cms - getTags - error');
                logger.logError(result.message);
                callback(result.message);
            } else {
                logger.logInfo('cms - getTags - response');
                logger.logInfo(result);
                callback(null, result);
            }
        });
    },

    getRoutes: function (channelId, callback) {
        var route = '/index.php?json_route=/get_routes';
        var id = '&channel_id=' + channelId;
        var url = config.cmsApiUrl + route + id;
        client.get(url).on('complete', function(result) {
            if (result instanceof Error) {
                logger.logError('cms - getRoutes - error');
                logger.logError(result.message);
                callback(result.message);
            } else {
                logger.logInfo('cms - getRoutes - response');
                logger.logInfo(result);
                callback(null, result);
            }
        });
    },

    getLineup: function (channelId, lineupDuration, callback) {
        var route = '/index.php?json_route=/lineup';
        var id = '&channel_id=' + channelId;
        var duration = '&lineup_duration=' + lineupDuration;
        var url = config.cmsApiUrl + route + id + duration;
        client.get(url).on('complete', function(result) {
            if (result instanceof Error) {
                logger.logError('cms - getLineup - error');
                logger.logError(result.message);
                callback(result.message);
            } else {
                logger.logInfo('cms - getLineup - response');
                logger.logInfo(result);
                callback(null, result);
            }
        });
    }
};
