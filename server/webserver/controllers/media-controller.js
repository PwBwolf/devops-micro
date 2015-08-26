'use strict';

var fs = require('fs'),
    crypto = require('crypto'),
    URI = require('URIjs'),
    logger = require('../../common/setup/logger'),
    date = require('../../common/services/date'),
    graceNote = require('../../common/services/grace-note'),
    _ = require('lodash');

var config = require('../../common/setup/config');
var mongoose = require('../../node_modules/mongoose');

require('../../common/models/channel');

var dbYip = mongoose.createConnection(config.db);
var Channel = dbYip.model('Channel');
var CmsCategory = dbYip.model('CmsCategory');

module.exports = {
    getChannel: function (req, res) {
        fs.readFile(__dirname + '/channels.json', 'utf8', function (err, data) {
            if (err) {
                logger.logError('mediaController - getUserChannels - error reading channels.json');
                logger.logError(err);
                return res.status(500).end();
            } else {
                var channels;
                try {
                    channels = JSON.parse(data);
                } catch (ex) {
                    logger.logError('mediaController - getUserChannels - error parsing channels.json file');
                    logger.logError(err);
                    return res.status(500).end();
                }
                if (!channels || channels.length === 0) {
                    logger.logError('mediaController - getUserChannels - channels.json file is empty');
                    return res.status(500).end();
                }
                var channel = _.find(channels, function (channel) {
                    return channel.id === req.query.id;
                });
                var now = new Date();
                var nowTime = now.getTime();
                var minusTen = new Date(nowTime - (10 * 60000));
                var validFrom = Math.floor(minusTen.getTime() / 1000);
                var plusTen = new Date(nowTime + (10 * 60000));
                var validTo = Math.floor(plusTen.getTime() / 1000);
                var url = new URI(channel.live_pc_url);
                var path = url.pathname() + '?valid_from=' + validFrom + '&valid_to=' + validTo;
                var hmac = crypto.createHmac('sha1', 'uFhpKCsBgF9KLlHT0E9rmQ');
                hmac.setEncoding('hex');
                hmac.write(path);
                hmac.end();
                var hash = hmac.read();
                if (hash.length > 20) {
                    hash = hash.substr(0, 20);
                }
                channel.live_pc_url = channel.live_pc_url + '?valid_from=' + validFrom + '&valid_to=' + validTo + '&hash=5' + hash;
                return res.json(channel);
            }
        });
    },

    getChannelGuide: function (req, res) {
        if (req.query.stationId) {
            var now = new Date();
            var startTime = date.isoDate(now);
            now.setHours(now.getHours() + Number(req.query.hours));
            var endTime = date.isoDate(now);
            graceNote.getChannelGuide(req.query.stationId, startTime, endTime, function (err, data) {
                if (err) {
                    logger.logError('mediaController - getUserChannels - error fetch channel guide from gracenote');
                    logger.logError(err);
                    return res.status(500).end();
                }
                return res.json(data);
            });
        } else {
            var guide = [{airings: [{startTime: '', endTime: '', program: {title: req.query.name, preferredImage: {uri: '/images/channels/nothumb.png'}}}]}];
            return res.json(guide);
        }
    },

    getUserChannels: function (req, res) {
        fs.readFile(__dirname + '/channels.json', 'utf8', function (err, data) {
            if (err) {
                logger.logError('mediaController - getUserChannels - error reading channels.json');
                logger.logError(err);
                return res.status(500).end();
            } else {
                var channels;
                try {
                    channels = JSON.parse(data);
                } catch (ex) {
                    logger.logError('mediaController - getUserChannels - error parsing channels.json file');
                    logger.logError(err);
                    return res.status(500).end();
                }
                if (!channels || channels.length === 0) {
                    logger.logError('mediaController - getUserChannels - channels.json file is empty');
                    return res.status(500).end();
                }
                return res.json(channels);
            }
        });
    },

    getChannelList: function (req, res) {
        Channel.find(req.query.stationIds === undefined ? {status: 'active'} : Array.isArray(req.query.stationIds) ? {stationId: {$in: req.query.stationIds}} : {stationId: req.query.stationIds}, {stationId: true, 'preferredImage.uri': true, callSign: true}, function (err, channelsDb) {
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

    getPromoChannels: function (req, res) {
        fs.readFile(__dirname + '/promos.json', 'utf8', function (err, data) {
            if (err) {
                logger.logError('mediaController - getPromoChannels - error reading promos.json');
                logger.logError(err);
                return res.status(500).end();
            } else {
                var channels;
                try {
                    channels = JSON.parse(data);
                } catch (ex) {
                    logger.logError('mediaController - getPromoChannels - error parsing promos.json file');
                    logger.logError(err);
                    return res.status(500).end();
                }
                if (!channels || channels.length === 0) {
                    logger.logError('mediaController - getPromoChannels - promos.json file is empty');
                    return res.status(500).end();
                }
                return res.json(channels);
            }
        });
    },

    getChannelCategories: function (req, res) {
        CmsCategory.find({}, function (err, categories) {
            if (err) {
                logger.logError('mediaController - getChannelCategories - error fetching categories');
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(categories);
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


