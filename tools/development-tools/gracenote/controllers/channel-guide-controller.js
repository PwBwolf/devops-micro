'use strict';

var config = require('../../../../server/common/setup/config');
var mongoose = require('../../../../server/node_modules/mongoose');
var date = require('../../../../server/common/services/date');
var logger = require('../../../../server/common/setup/logger');

require('../../../../server/common/models/channel');

var dbYip = mongoose.createConnection(config.db);

var Channel = dbYip.model('Channel');

module.exports = {

    getChannelList : function(req, res) {

        Channel.find(req.query.stationIds === undefined ? {status: 'active'} : {
            stationId : {
                $in : req.query.stationIds
            }
        }, {
            stationId : true,
            "preferredImage.uri" : true,
            callSign : true
        }, function(err, channelsDb) {
            if (err) {
                logger.logError('channel-guide-controller - getChannelList - failed to retrieve channel list: ' + err);
            } else {
                logger.logInfo('channel-guide-controller - getChannelList - total documents found in db: '
                        + channelsDb.length);

                res.json({
                    channelsDb : channelsDb
                });
            }
        });
    },

    getChannelInfo : function(req, res) {
        var nowTime = new Date();
        var startTime = date.isoDate(nowTime);
        logger.logInfo('channel-guide-controller - getChannelInfo - startTime:' + startTime);

        var endTime = req.query.period === undefined ? date.isoDate(dateAdd(nowTime, 'day', 14)) : date.isoDate(dateAdd(nowTime, 'hour', req.query.period));
        logger.logInfo('channel-guide-controller - getChannelInfo - endTime:' + endTime);

        Channel.aggregate([{$match: {stationId : req.query.stationId}}, 
                           {$unwind: "$airings"}, 
                           {$match: {"airings.endTime": {$gt: startTime, $lte: endTime}}}, 
                           {$project: {stationId: true, 'airings.program.preferredImage.uri' : true, 'airings.endTime' : true, 'airings.startTime' : true, 'airings.program.tmsId' : true, 'airings.program.title' : true, callSign : true}}], 
                           function(err, channelsDb) {
            if (err) {
                logger.logError('channel-guide-controller - getChannelInfo - failed to retrieve channel info from db: ' + err);
            } else {
                logger.logInfo('channel-guide-controller - getChannelInfo - airings found: ' + channelsDb.length);

                res.json({
                    channelsDb : channelsDb
                });
            }
        });
    },

    getProgramDetail : function(req, res) {

        Channel.aggregate([{$match: {stationId : req.query.stationId}}, 
                           {$unwind: '$airings'}, 
                           //{$match: {'airings.program.tmsId': req.query.tmsId, 'airings.startTime': date.isoDate(new Date(req.query.startTime))}},
                           {$match: {'airings.program.tmsId': req.query.tmsId}},
                           {$project: {stationId: true, 
                                       'airings.program.preferredImage.uri' : true, 
                                       //'airings.duration': true, 
                                       //'airings.endTime' : true, 
                                       //'airings.startTime' : true, 
                                       'airings.program.tmsId' : true, 
                                       'airings.program.title' : true, 
                                       'airings.program.genres': true, 
                                       'airings.program.longDescription': true,
                                       'airings.program.topCast': true,
                                       'airings.program.directors': true,
                                       'airings.program.entityType': true,
                                       callSign : true}},
                           {$limit: 1}], 
                           function(err, channelsDb) {
            if (err) {
                logger.logError('channel-guide-controller - getProgramDetail - failed to retrieve program detail from db: ' + err);
            } else {
                logger.logInfo('channel-guide-controller - getProgramDetail - total documents found in channelsDb: '
                        + channelsDb.length);

                res.json({
                    channelsDb : channelsDb[0]
                });
            }
        });
    }
};

function dateAdd(date, interval, units) {
    var ret = new Date(date); // don't change original date
    switch (interval.toLowerCase()) {
    case 'year':
        ret.setFullYear(ret.getFullYear() + units);
        break;
    case 'quarter':
        ret.setMonth(ret.getMonth() + 3 * units);
        break;
    case 'month':
        ret.setMonth(ret.getMonth() + units);
        break;
    case 'week':
        ret.setDate(ret.getDate() + 7 * units);
        break;
    case 'day':
        ret.setDate(ret.getDate() + units);
        break;
    case 'hour':
        ret.setTime(ret.getTime() + units * 3600000);
        break;
    case 'minute':
        ret.setTime(ret.getTime() + units * 60000);
        break;
    case 'second':
        ret.setTime(ret.getTime() + units * 1000);
        break;
    default:
        ret = undefined;
        break;
    }
    return ret;
}
