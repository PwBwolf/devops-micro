'use strict';

var config = require('../../../../server/common/setup/config');
var mongoose = require('../../../../server/node_modules/mongoose');
var date = require('../../../../server/common/services/date');
var logger = require('../../../../server/common/setup/logger');

require('../../../../server/common/models/channel');
require('../../image-download/models/image-data');

var dbYip = mongoose.createConnection(config.db);

var Channel = dbYip.model('Channel');
var ImageData = dbYip.model('ImageData');

module.exports = {

    getChannelList: function (req, res) {
        Channel.find(req.query.stationIds === undefined ? {status: 'active'} : {stationId: {$in: req.query.stationIds}}, {stationId: true, 'preferredImage.uri': true, callSign: true}, function (err, channelsDb) {
            if (err) {
                logger.logError('mediaController - getChannelList - failed to retrieve channel list');
                logger.logError(err);
                return res.status(500).end();
            }
            res.json(channelsDb);
        });
    },

    getChannelInfo: function (req, res) {
        var nowTime = new Date();
        var startTime = date.isoDate(nowTime);
        logger.logInfo('mediaController - getChannelInfo - startTime:' + startTime);
        var endTime = req.query.period === undefined ? date.isoDate(dateAdd(nowTime, 'day', 14)) : date.isoDate(dateAdd(nowTime, 'hour', req.query.period));
        logger.logInfo('mediaController - getChannelInfo - endTime:' + endTime);
        Channel.aggregate([{$match: {stationId: req.query.stationId}},
                {$unwind: '$airings'},
                {$match: {'airings.endTime': {$gt: startTime, $lte: endTime}}},
                {
                    $project: {
                        stationId: true,
                        'airings.program.preferredImage.uri': true,
                        'airings.endTime': true,
                        'airings.startTime': true,
                        'airings.program.tmsId': true,
                        'airings.program.title': true,
                        'airings.ratings.code': true,
                        callSign: true
                    }
                }],
            function (err, channelsDb) {
                if (err) {
                    logger.logError('mediaController - getChannelInfo - failed to retrieve channel info from db');
                    logger.logError(err);
                    return res.status(500).end();
                }
                res.json(channelsDb);
            });
    },

    getProgramDetail: function (req, res) {
        Channel.aggregate([{$match: {stationId: req.query.stationId}},
                {$unwind: '$airings'},
                {$match: {'airings.program.tmsId': req.query.tmsId}},
                {
                    $project: {
                        stationId: true,
                        'airings.program.preferredImage.uri': true,
                        'airings.program.tmsId': true,
                        'airings.program.title': true,
                        'airings.program.genres': true,
                        'airings.program.longDescription': true,
                        'airings.program.topCast': true,
                        'airings.program.directors': true,
                        'airings.program.entityType': true,
                        callSign: true
                    }
                },
                {$limit: 1}],
            function (err, channelsDb) {
                if (err) {
                    logger.logError('mediaController - getProgramDetail - failed to retrieve program detail from db');
                    logger.logError(err);
                    return res.status(500).end();
                }
                res.json(channelsDb[0]);
            });
    },
    
    getChannelLogo: function(req, res) {
        if(req.query.stationId === undefined) {
            return res.status(500).end();
        }
        Channel.find({stationId: req.query.stationId}, {'preferredImage.uri': true}, function (err, channelsDb) {
            if (err) {
                logger.logError('mediaController - getChannelLogo - failed to retrieve uri');
                logger.logError(err);
                return res.status(500).end();
            }
            
            ImageData.find({uri: channelsDb[0].preferredImage.uri}, function(err, images) {
            //ImageData.find({uri: "assets/p10781404_st_v5_aa.jpg"}, function(err, images) {
                if (err) {
                    logger.logError('mediaController - getChannelLogo - failed to retrieve logo');
                    logger.logError(err);
                    return res.status(500).end();
                }
                res.writeHead(200, {'Content-Type': 'image'});
                res.end(images[0].data, 'binary');
                //res.data = images[0].data;
            });
            
        });
    }
};

function dateAdd(date, interval, units) {
    var newDate = new Date(date);
    switch (interval.toLowerCase()) {
        case 'year':
            newDate.setFullYear(newDate.getFullYear() + units);
            break;
        case 'quarter':
            newDate.setMonth(newDate.getMonth() + 3 * units);
            break;
        case 'month':
            newDate.setMonth(newDate.getMonth() + units);
            break;
        case 'week':
            newDate.setDate(newDate.getDate() + 7 * units);
            break;
        case 'day':
            newDate.setDate(newDate.getDate() + units);
            break;
        case 'hour':
            newDate.setTime(newDate.getTime() + units * 3600000);
            break;
        case 'minute':
            newDate.setTime(newDate.getTime() + units * 60000);
            break;
        case 'second':
            newDate.setTime(newDate.getTime() + units * 1000);
            break;
        default:
            newDate = undefined;
            break;
    }
    return newDate;
}
