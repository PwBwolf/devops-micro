'use strict';

var config = require('../../../../server/common/setup/config');
var mongoose = require('../../../../server/node_modules/mongoose');
var date = require('../../../../server/common/services/date');
var logger = require('../../../../server/common/setup/logger');

require('../../../../server/common/models/channel');
require('../../../../server/common/models/image-data');
require('../../../../server/common/models/image');

var dbYip = mongoose.createConnection(config.db);

var Channel = dbYip.model('Channel');
var Image = dbYip.model('Image');
var ImageData = dbYip.model('ImageData');

module.exports = {
    getChannelList: function (req, res) {
        
        var projectionObj = {};
        projectionObj['stationId'] = true;
        projectionObj['callSign'] = true;
        projectionObj['preferredImage.uri'] = true;
        if(req.query.projections) {
            if(Array.isArray(req.query.projections)) {
                for (var i = 0; i < req.query.projections.length; i++) {
                    projectionObj[req.query.projections[i]] = true;
                }
            } else {
                projectionObj[req.query.projections] = true;
            }
        }
        
        //Channel.find(req.query.stationIds === undefined ? {status: 'active'} : Array.isArray(req.query.stationIds) ? {stationId: {$in: req.query.stationIds}} : {stationId: req.query.stationIds}, {stationId: true, 'preferredImage.uri': true, callSign: true}, function (err, channelsDb) {
        //Channel.find(req.query.stationIds === undefined ? {status: 'active'} : Array.isArray(req.query.stationIds) ? {stationId: {$in: req.query.stationIds}} : {stationId: req.query.stationIds}, {stationId: true, 'preferredImage.uri': true, callSign: true})
        Channel.find(req.query.stationIds === undefined ? {status: 'active'} : Array.isArray(req.query.stationIds) ? {stationId: {$in: req.query.stationIds}} : {stationId: req.query.stationIds}, projectionObj)
        .limit(200).exec(function (err, channelsDb) {
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
        
        var projectionObj = {};
        projectionObj['stationId'] = true;
        projectionObj['callSign'] = true;
        projectionObj['airings.program.preferredImage.uri'] = true;
        projectionObj['airings.endTime'] = true;
        projectionObj['airings.startTime'] = true;
        projectionObj['airings.program.tmsId'] = true;
        projectionObj['airings.program.title'] = true;
        projectionObj['airings.ratings.code'] = true;
        if(req.query.projections) {
            if(Array.isArray(req.query.projections)) {
                for (var i = 0; i < req.query.projections.length; i++) {
                    projectionObj[req.query.projections[i]] = true;
                }
            } else {
                projectionObj[req.query.projections] = true;
            }
        }
        
        Channel.aggregate([{$match: {stationId: req.query.stationId}},
                {$unwind: '$airings'},
                {$match: {'airings.endTime': {$gt: startTime, $lte: endTime}}},
                {$project: projectionObj}],
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
        
        var projectionObj = {};
        projectionObj['stationId'] = true;
        projectionObj['callSign'] = true;
        projectionObj['airings.program.preferredImage.uri'] = true;
        projectionObj['airings.program.tmsId'] = true;
        projectionObj['airings.program.title'] = true;
        projectionObj['airings.program.genres'] = true;
        projectionObj['airings.program.longDescription'] = true;
        projectionObj['airings.program.topCast'] = true;
        projectionObj['airings.program.directors'] = true;
        projectionObj['airings.program.entityType'] = true;
        if(req.query.projections) {
            if(Array.isArray(req.query.projections)) {
                for (var i = 0; i < req.query.projections.length; i++) {
                    projectionObj[req.query.projections[i]] = true;
                }
            } else {
                projectionObj[req.query.projections] = true;
            }
        }
        
        Channel.aggregate([{$match: {stationId: req.query.stationId}},
                {$unwind: '$airings'},
                {$match: {'airings.program.tmsId': req.query.tmsId}},
                {$project: projectionObj},
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

        Image.find(req.query.stationIds === undefined ? {active: true, type: 'channel'} : Array.isArray(req.query.stationIds) ? {identifier: {$in: req.query.stationIds}} : {identifier: req.query.stationIds})
        .populate('dataId').exec(function(err, images) {
            if(err) {
               logger.logError('channelGuideController - getChannelLogo - failed to query Image db');
               logger.logError(err);
               return res.status(500).end();
            } else {
               if(images.length === 0) {
                   logger.logError('channelGuideController - getChannelLogo - query Image db with 0 return');
                   return res.status(500).end();
               } else {
                   res.writeHead(200, {'Content-Type': 'image'});
                   var imageData = '';
                   for(var i = 0; i < images.length; i++) {
                       if(i === 0) {
                           imageData += images[i].dataId.data;
                       } else {
                           imageData += ('$' + images[i].dataId.data);
                       }
                   }
                   res.end(imageData, 'binary');
               }
            }  
        });
    },
    
    getProgramImage: function(req, res) {

        //Image.find(req.query.tmsIds === undefined ? {type: 'program'} : Array.isArray(req.query.tmsIds) ? {identifier: {$in: req.query.tmsIds}} : {identifier: req.query.tmsIds})
        Image.find(req.query.uris === undefined ? {type: 'program'} : Array.isArray(req.query.uris) ? {'preferredImage.uri': {$in: req.query.uris}} : {'preferredImage.uri': req.query.uris})
        .populate('dataId').limit(req.query.uris === undefined ? 10 : Array.isArray(req.query.uris) ? req.query.uris.length : 1).exec(function(err, images) {
            if(err) {
               logger.logError('channelGuideController - getProgramImage - failed to query Image db');
               logger.logError(err);
               return res.status(500).end();
            } else {
               if(images.length === 0) {
                   logger.logError('channelGuideController - getProgramImage - query Image db with 0 return');
                   return res.status(500).end();
               } else {
                   res.writeHead(200, {'Content-Type': 'image'});
                   var imageData='';
                   for(var i = 0; i < images.length; i++) {
                       if(i === 0) {
                           imageData += images[i].dataId.data;
                       } else {
                           imageData += ('$' + images[i].dataId.data);
                       }
                   }
                   res.end(imageData, 'binary');
               }
            }  
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
