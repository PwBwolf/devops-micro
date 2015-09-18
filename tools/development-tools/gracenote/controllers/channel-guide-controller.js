'use strict';

var config = require('../../../../server/common/setup/config');
var mongoose = require('../../../../server/node_modules/mongoose');
var date = require('../../../../server/common/services/date');
var logger = require('../../../../server/common/setup/logger');
var async = require('../../../../server/node_modules/async');

require('../../../../server/common/models/channel');
require('../../../../server/common/models/image-data');
require('../../../../server/common/models/image');
require('../../xml-xlsx-parser/models/airing');
require('../../xml-xlsx-parser/models/event');

var dbYip = mongoose.createConnection(config.db);
var dbMetaData = mongoose.createConnection(config.yipMetaDataDb);

var Channel = dbYip.model('Channel');
var Image = dbYip.model('Image');
var ImageData = dbYip.model('ImageData');
var Airing = dbMetaData.model('Airing');
var Event = dbMetaData.model('Event');

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
        
        var models = getDbModels(req.query.source);
        
        async.concat(
            models,
            
            function(item, cb) {
                switch(item) {
                case 'Channel':
                    Channel.find(req.query.stationIds === undefined ? {status: 'active'} : Array.isArray(req.query.stationIds) ? {stationId: {$in: req.query.stationIds}} : {stationId: req.query.stationIds}, projectionObj)
                    .exec(function (err, channelsDb) {
                        if (err) {
                            logger.logError('mediaController - getChannelList - failed to retrieve channel list from Channel collections');
                            logger.logError(err);
                            cb(err);
                        } else {
                            logger.logInfo('mediaController - getChannelList - channel list from Channel collections: ' + channelsDb.length);
                            cb(null, channelsDb);
                        }
                    });
                    break;
                case 'Airing':
                    projectionObj['source'] = true;
                    projectionObj['fileName'] = true;
                    projectionObj['type'] = true;
                    Airing.find(req.query.stationIds === undefined ? {} : Array.isArray(req.query.stationIds) ? {source: {$in: req.query.stationIds}} : {source: req.query.stationIds}, projectionObj)
                    .exec(function (err, airings) {
                        if (err) {
                            logger.logError('mediaController - getChannelList - failed to retrieve channel list from Airing collections');
                            logger.logError(err);
                            cb(err);
                        } else {
                            logger.logInfo('mediaController - getChannelList - channel list from Airing collections: ' + airings.length);
                            var airingsArray = [];
                            for(var i = 0; i < airings.length; ++i) {
                                airingsArray.push({stationId: airings[i].source, callSign: airings[i].source});
                            }
                            cb(null, airingsArray);
                        }
                    });
                    break;
                case 'Event':
                    projectionObj['source'] = true;
                    projectionObj['fileName'] = true;
                    projectionObj['type'] = true;
                    Event.find(req.query.stationIds === undefined ? {} : Array.isArray(req.query.stationIds) ? {source: {$in: req.query.stationIds}} : {source: req.query.stationIds}, projectionObj)
                    .exec(function (err, events) {
                        if (err) {
                            logger.logError('mediaController - getChannelList - failed to retrieve channel list from Event collections');
                            logger.logError(err);
                            cb(err);
                        } else {
                            logger.logInfo('mediaController - getChannelList - channel list from Event collections: ' + events.length);
                            var eventsArray = [];
                            for(var i = 0; i < events.length; ++i) {
                                eventsArray.push({stationId: events[i].source, callSign: events[i].source});
                            }
                            cb(null, eventsArray);
                        }
                    });
                    break;
                }
            },
        
            function(err, results) {
                if(err) {
                    logger.logError('mediaController - getChannelList - failed to retrieve channel list from collections: ' + models);
                    logger.logError(err);
                    return res.status(500).end();
                } else {
                    logger.logInfo('mediaController - getChannelList - final channel list from collections: ' + results.length);
                    res.json(results);
                }             
            }
        );
    },

    getChannelInfo: function (req, res) {
        var nowTime = new Date();
        var startTime = date.isoDate(nowTime);
        var startTimeUTC = (new Date(Date.UTC(nowTime.getUTCFullYear(), nowTime.getUTCMonth(), nowTime.getUTCDate(), nowTime.getUTCHours(), nowTime.getUTCMinutes(), nowTime.getUTCSeconds())));
        logger.logInfo('mediaController - getChannelInfo - startTime:' + startTime);
        var tempTime = req.query.period === undefined ? dateAdd(nowTime, 'day', 24) : dateAdd(nowTime, 'hour', req.query.period);
        var endTime = date.isoDate(tempTime);
        var endTimeUTC = (new Date(Date.UTC(tempTime.getUTCFullYear(), tempTime.getUTCMonth(), tempTime.getUTCDate(), tempTime.getUTCHours(), tempTime.getUTCMinutes(), tempTime.getUTCSeconds())));
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
        
        var models = getDbModels(req.query.source);
        
        async.concat(
            models,
            
            function(item, cb) {
                switch(item) {
                case 'Channel':
                    Channel.aggregate(
                        [
                           {$match: {stationId: req.query.stationId}},
                           {$unwind: '$airings'},
                           {$match: {'airings.endTime': {$gt: startTime, $lte: endTime}}},
                           {$project: projectionObj}
                        ],
                        function (err, channelsDb) {
                            if (err) {
                                logger.logError('mediaController - getChannelInfo - failed to retrieve channel info from Channel collection');
                                logger.logError(err);
                                cb(err);
                            } else {
                                logger.logInfo('mediaController - getChannelInfo - channel info from Channel collection: ' + channelsDb.length);
                                cb(null, channelsDb);
                            }
                        }
                    );
                    break;
                case 'Airing':
                    projectionObj['source'] = true;
                    projectionObj['fileName'] = true;
                    projectionObj['type'] = true;
                    projectionObj['airings.title'] = true;
                    Airing.aggregate(
                        [
                           {$match: {source: req.query.stationId}},
                           {$unwind: '$airings'},
                           {$match: {'airings.startTime': {$gte: startTimeUTC, $lte: endTimeUTC}}},
                           {$project: projectionObj}
                        ],
                        function (err, airings) {
                            if (err) {
                                logger.logError('mediaController - getChannelInfo - failed to retrieve channel info from Airing collection');
                                logger.logError(err);
                                cb(err);
                            } else {
                                logger.logInfo('mediaController - getChannelInfo - channel info from Airing collection: ' + airings.length);
                                
                                if(airings.length > 0) {
                                    var airingsArray = [];
                                    for(var i = 0; i < airings.length; ++i) {
                                        var airingInfo = {
                                            stationId: airings[i].source, 
                                            callSign: airings[i].source, 
                                            airings: {
                                                startTime: airings[i].airings.startTime,
                                                endTime: airings[i].airings.endTime,
                                                program: {
                                                    title: airings[i].airings.title, 
                                                    tmsId: airings[i].airings.title
                                                }
                                            }
                                        };
                                        airingsArray.push(airingInfo);
                                    }
                                    cb(null, airingsArray);
                                } else {
                                    cb(null, airings);
                                }
                            }
                        }
                    );
                    break;
                case 'Event':
                    projectionObj['source'] = true;
                    projectionObj['fileName'] = true;
                    projectionObj['type'] = true;
                    projectionObj['airings.title'] = true;
                    projectionObj['airings.mediaId'] = true;
                    Event.aggregate(
                        [
                           {$match: {source: req.query.stationId}},
                           {$unwind: '$airings'},
                           {$match: {'airings.startTime': {$gt: startTimeUTC, $lte: endTimeUTC}}},
                           {$project: projectionObj}
                        ],
                        function (err, events) {
                            if (err) {
                                logger.logError('mediaController - getChannelInfo - failed to retrieve channel info from Event collection');
                                logger.logError(err);
                                cb(err);
                            } else {
                                logger.logInfo('mediaController - getChannelInfo - channel info from Event collection: ' + events.length);
                                if(events.length > 0) {
                                    var eventsArray = [];
                                                                        
                                    for(var i = 0; i < events.length; ++i) {
                                        var eventInfo = {
                                            stationId: events[i].source, 
                                            callSign: events[i].source, 
                                            airings: {
                                                startTime: events[i].airings.startTime,
                                                endTime: events[i].airings.endTime,
                                                program: {
                                                    title: events[i].airings.title, 
                                                    tmsId: events[i].airings.mediaId
                                                }
                                            }
                                        };
                                        eventsArray.push(eventInfo);
                                    }
                                    cb(null, eventInfo);
                                } else {
                                    cb(null, events);
                                }
                            }
                        }
                    );
                    break;
                }
            },
        
            function(err, results) {
                if(err) {
                    logger.logError('mediaController - getChannelInfo - failed to retrieve channel list from collections: ' + models);
                    logger.logError(err);
                    return res.status(500).end();
                } else {
                    logger.logInfo('mediaController - getChannelInfo - final channel info from collection: ' + results.length);
                    res.json(results);
                }             
            }
        );
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
        
        var models = getDbModels(req.query.source);
        
        async.concat(
            models,
            
            function(item, cb) {
                switch(item) {
                case 'Channel':
                    Channel.aggregate(
                        [
                            {$match: {stationId: req.query.stationId}},
                            {$unwind: '$airings'},
                            {$match: {'airings.program.tmsId': req.query.tmsId}},
                            {$project: projectionObj},
                            {$limit: 1}
                        ],
                        
                        function (err, channelsDb) {
                            if (err) {
                                logger.logError('mediaController - getProgramDetail - failed to retrieve program detail from Channel collection');
                                logger.logError(err);
                                cb(err);
                            } else {
                                logger.logInfo('mediaController - getProgramDetail - program detail from Channel collection: ' + channelsDb.length);
                                cb(null, channelsDb);
                            }
                        }
                    );
                    break;
                case 'Airing':
                    projectionObj['source'] = true;
                    projectionObj['fileName'] = true;
                    projectionObj['type'] = true;
                    projectionObj['airings.title'] = true;
                    projectionObj['airings.synopsis'] = true;
                    Airing.aggregate(
                        [
                            {$match: {source: req.query.stationId}},
                            {$unwind: '$airings'},
                            {$match: {'airings.title': req.query.tmsId}},
                            {$project: projectionObj},
                            {$limit: 1}
                        ],
                        
                        function (err, airings) {
                            if (err) {
                                logger.logError('mediaController - getProgramDetail - failed to retrieve program detail from Airing collection');
                                logger.logError(err);
                                cb(err);
                            } else {
                                logger.logInfo('mediaController - getProgramDetail - program detail from Airing collection: ' + airings.length);
                                
                                if(airings.length > 0) {
                                    var airingsArray = [];
                                    for(var i = 0; i < airings.length; ++i) {
                                        var airingInfo = {
                                            stationId: airings[i].source, 
                                            callSign: airings[i].source, 
                                            airings: {
                                                startTime: airings[i].airings.startTime,
                                                endTime: airings[i].airings.endTime,
                                                program: {
                                                    title: airings[i].airings.title, 
                                                    tmsId: airings[i].airings.title,
                                                    longDescription: airings[i].airings.synopsis
                                                }
                                            }
                                        };
                                        airingsArray.push(airingInfo);
                                    }
                                    cb(null, airingsArray);
                                } else {
                                    cb(null, airings);
                                }
                            }
                        }
                    );
                    break;
                case 'Event':
                    projectionObj['source'] = true;
                    projectionObj['fileName'] = true;
                    projectionObj['type'] = true;
                    projectionObj['airings.title'] = true;
                    projectionObj['airings.mediaId'] = true;
                    projectionObj['airings.eitLong'] = true;
                    Event.aggregate(
                        [
                            {$match: {source: req.query.stationId}},
                            {$unwind: '$airings'},
                            {$match: {'airings.mediaId': req.query.tmsId}},
                            {$project: projectionObj},
                            {$limit: 1}
                        ],
                        function (err, events) {
                            if (err) {
                                logger.logError('mediaController - getProgramDetail - failed to retrieve program detail from Event collection');
                                logger.logError(err);
                                cb(err);
                            } else {
                                logger.logInfo('mediaController - getProgramDetail - program detail from Event collection: ' + events.length);
                                if(events.length > 0) {
                                    var eventsArray = [];
                                                                        
                                    for(var i = 0; i < events.length; ++i) {
                                        var eventInfo = {
                                            stationId: events[i].source, 
                                            callSign: events[i].source, 
                                            airings: {
                                                startTime: events[i].airings.startTime,
                                                endTime: events[i].airings.endTime,
                                                program: {
                                                    title: events[i].airings.title, 
                                                    tmsId: events[i].airings.mediaId,
                                                    longDescription: events[i].airings.eitLong
                                                }
                                            }
                                        };
                                        eventsArray.push(eventInfo);
                                    }
                                    cb(null, eventInfo);
                                } else {
                                    cb(null, events);
                                }
                            }
                        }
                    );
                    break;
                }
            },
        
            function(err, results) {
                if(err) {
                    logger.logError('mediaController - getChannelInfo - failed to retrieve channel list from collections: ' + models);
                    logger.logError(err);
                    return res.status(500).end();
                } else {
                    logger.logInfo('mediaController - getChannelInfo - final channel info from collection: ' + results.length);
                    res.json(results.length > 0 ? results[0] : results);
                }             
            }
        );
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

function getDbModels(sources) {
    var models = [];
    if(sources && Array.isArray(sources)) {
        for(var i = 0; i < sources.length; ++i) {
            models.push(sources[i]);
        }
    } else if(sources) {
        models.push(sources);
    } else {
        models = models.concat(['Channel', 'Airing', 'Event']);
    }
    return models;
}

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
