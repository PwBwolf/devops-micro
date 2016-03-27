'use strict';

var _ = require('lodash'),
    crypto = require('crypto'),
    moment = require('moment'),
    URI = require('URIjs'),
    logger = require('../../common/setup/logger'),
    date = require('../../common/services/date'),
    cms = require('../../common/services/cms'),
    config = require('../../common/setup/config'),
    graceNote = require('../../common/services/grace-note'),
    PythonShell = require('python-shell'),
    mongoose = require('../../node_modules/mongoose'),
    async = require('../../node_modules/async'),
    User = mongoose.model('User'),
    Channel = mongoose.model('Channel'),
    Image = mongoose.model('Image'),
    Airing = mongoose.model('Airing'),
    Event = mongoose.model('Event'),
    CmsAd = mongoose.model('CmsAd');

module.exports = {
    getChannelUrl: function (req, res) {
        cms.getRoutes(req.query.id, function (err, data) {
            if (err) {
                logger.logError('mediaController - getChannelUrl - error fetching channel url');
                logger.logError(err);
                return res.status(500).end();
            }
            if (data && data.routes && data.routes.length > 0) {
                return res.json(data);
            } else {
                return res.status(500).end();
            }
        });
    },

    getChannelGuide: function (req, res) {
        cms.getLineup(req.query.id, req.query.hours, function (err, data) {
            if (err) {
                logger.logError('mediaController - getChannelGuide - error fetching lineup');
                logger.logError(err);
                return res.status(500).end();
            }
            if (data && data.programs) {
                return res.json(data.programs);
            } else {
                return res.status(500).end();
            }
        });
    },

    getChannelGuideAll: function (req, res) {
        cms.getLineup(req.query.id, req.query.hours, function (err, data) {
            if (err) {
                logger.logError('mediaController - getChannelGuideAll - error fetching lineup');
                logger.logError(err);
                return res.status(500).end();
            }
            if (data) {
                res.set('Cache-Control', 'public, max-age=300');
                res.set('Expires', new Date(Date.now() + 300000).toUTCString());
                return res.json(data);
            } else {
                return res.status(500).end();
            }
        });
    },

    getUserChannels: function (req, res) {
        User.findOne({email: req.email}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('mediaController - getUserChannels - error fetching user: ' + req.email);
                logger.logError(err);
                return res.status(500).end();
            }
            var packages = 'free';
            var diff = moment.utc().startOf('day').diff(moment(user.account.startDate).utc().startOf('day'), 'days');
            if (user.account.type === 'paid' || user.account.type === 'comp') {
                packages = 'free,premium,paid'
            } else if (user.account.type === 'free' && diff <= 7 && !user.cancelDate && !user.complimentaryEndDate) {
                packages = 'free,premium'
            }
            cms.getChannels(packages, function (err, data) {
                if (err) {
                    logger.logError('mediaController - getUserChannels - error fetching channels');
                    logger.logError(err);
                    return res.status(500).end();
                }
                if (data && data.channels_list && data.channels_list.length > 0) {
                    res.set('Cache-Control', 'public, max-age=480');
                    res.set('Expires', new Date(Date.now() + 480000).toUTCString());
                    return res.json(data);
                } else {
                    return res.status(500).end();
                }
            });
        });
    },

    getChannelCategories: function (req, res) {
        cms.getTags(function (err, data) {
            if (err) {
                logger.logError('mediaController - getChannelCategories - error fetching categories');
                logger.logError(err);
                return res.status(500).end();
            }
            if (data && data.categories && data.categories.length > 0) {
                res.set('Cache-Control', 'public, max-age=480');
                res.set('Expires', new Date(Date.now() + 480000).toUTCString());
                return res.json(data);
            } else {
                return res.status(500).end();
            }
        });
    },

    getChannelList: function (req, res) {
        var projectionObj = {};
        projectionObj['stationId'] = true;
        projectionObj['callSign'] = true;
        projectionObj['preferredImage.uri'] = true;
        if (req.query.projections) {
            if (Array.isArray(req.query.projections)) {
                for (var i = 0; i < req.query.projections.length; i++) {
                    projectionObj[req.query.projections[i]] = true;
                }
            } else {
                projectionObj[req.query.projections] = true;
            }
        }
        var models = getDbModels(req.query.sources);
        async.concat(
            models,
            function (item, cb) {
                switch (item) {
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
                                    for (var i = 0; i < airings.length; ++i) {
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
                                    for (var i = 0; i < events.length; ++i) {
                                        eventsArray.push({stationId: events[i].source, callSign: events[i].source});
                                    }
                                    cb(null, eventsArray);
                                }
                            });
                        break;
                }
            },

            function (err, results) {
                if (err) {
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
        if (req.query.projections) {
            if (Array.isArray(req.query.projections)) {
                for (var i = 0; i < req.query.projections.length; i++) {
                    projectionObj[req.query.projections[i]] = true;
                }
            } else {
                projectionObj[req.query.projections] = true;
            }
        }
        var models = getDbModels(req.query.sources);
        async.concat(
            models,
            function (item, cb) {
                switch (item) {
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

                                    if (airings.length > 0) {
                                        var airingsArray = [];
                                        for (var i = 0; i < airings.length; ++i) {
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
                                    if (events.length > 0) {
                                        var eventsArray = [];

                                        for (var i = 0; i < events.length; ++i) {
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

            function (err, results) {
                if (err) {
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
        if (req.query.projections) {
            if (Array.isArray(req.query.projections)) {
                for (var i = 0; i < req.query.projections.length; i++) {
                    projectionObj[req.query.projections[i]] = true;
                }
            } else {
                projectionObj[req.query.projections] = true;
            }
        }
        var models = getDbModels(req.query.sources);
        async.concat(
            models,
            function (item, cb) {
                switch (item) {
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
                                    if (airings.length > 0) {
                                        var airingsArray = [];
                                        for (var i = 0; i < airings.length; ++i) {
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
                                    if (events.length > 0) {
                                        var eventsArray = [];

                                        for (var i = 0; i < events.length; ++i) {
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

            function (err, results) {
                if (err) {
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

    getChannelLogo: function (req, res) {
        Image.find(req.query.stationIds === undefined ? {
            active: true,
            type: 'channel'
        } : Array.isArray(req.query.stationIds) ? {identifier: {$in: req.query.stationIds}} : {identifier: req.query.stationIds}).populate('dataId').exec(function (err, images) {
            if (err) {
                logger.logError('channelGuideController - getChannelLogo - failed to query Image db');
                logger.logError(err);
                return res.status(500).end();
            } else {
                if (images.length === 0) {
                    logger.logError('channelGuideController - getChannelLogo - query Image db with 0 return');
                    return res.status(500).end();
                } else {
                    res.writeHead(200, {'Content-Type': 'image'});
                    var imageData = '';
                    for (var i = 0; i < images.length; i++) {
                        if (i === 0) {
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

    getProgramImage: function (req, res) {
        Image.find(req.query.uris === undefined ? {type: 'program'} : Array.isArray(req.query.uris) ? {'preferredImage.uri': {$in: req.query.uris}} : {'preferredImage.uri': req.query.uris})
            .populate('dataId').limit(req.query.uris === undefined ? 10 : Array.isArray(req.query.uris) ? req.query.uris.length : 1).exec(function (err, images) {
            if (err) {
                logger.logError('channelGuideController - getProgramImage - failed to query Image db');
                logger.logError(err);
                return res.status(500).end();
            } else {
                if (images.length === 0) {
                    logger.logError('channelGuideController - getProgramImage - query Image db with 0 return');
                    return res.status(500).end();
                } else {
                    res.writeHead(200, {'Content-Type': 'image'});
                    var imageData = '';
                    for (var i = 0; i < images.length; i++) {
                        if (i === 0) {
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

function getDbModels(sources) {
    var models = [];
    if (sources && Array.isArray(sources)) {
        for (var i = 0; i < sources.length; ++i) {
            models.push(sources[i]);
        }
    } else if (sources) {
        models.push(sources);
    } else {
        models = models.concat(['Channel', 'Airing', 'Event']);
    }
    return models;
}

function getLevel3Token(channel) {
    var now = new Date();
    var nowTime = now.getTime();
    var minus = new Date(nowTime - (config.cdnTokenDuration * 1000));
    var validFrom = Math.floor(minus.getTime() / 1000);
    var plus = new Date(nowTime + (config.cdnTokenDuration * 1000));
    var validTo = Math.floor(plus.getTime() / 1000);
    var url = new URI(channel.videoUrl);
    var path = url.pathname() + '?valid_from=' + validFrom + '&valid_to=' + validTo;
    var hmac = crypto.createHmac('sha1', 'uFhpKCsBgF9KLlHT0E9rmQ');
    hmac.setEncoding('hex');
    hmac.write(path);
    hmac.end();
    var hash = hmac.read();
    if (hash.length > 20) {
        hash = hash.substr(0, 20);
    }
    return '?valid_from=' + validFrom + '&valid_to=' + validTo + '&hash=5' + hash;
}

function getAkamaiToken(channel, callback) {
    var url = new URI(channel.videoUrl);
    var path = url.pathname();
    if (path.indexOf('/i/') === 0) {
        path = '/i/*' + path.substr(path.indexOf('@') + 1, path.lastIndexOf('/') - path.indexOf('@')) + '*';
    } else {
        var split = path.split('/');
        path = '/' + split[1] + '/' + split[2] + '/' + split[3] + '*';
    }
    var options = {
        scriptPath: __dirname,
        args: ['-w', config.cdnTokenDuration, '-a', path, '-k', '33554645784d376b484a474b62365673']
    };
    PythonShell.run('akamai_token_v2.py', options, function (err, result) {
        callback(err, '?' + result);
    });
}
