'use strict';

var _ = require('lodash'),
    crypto = require('crypto'),
    URI = require('URIjs'),
    logger = require('../../common/setup/logger'),
    date = require('../../common/services/date'),
    cms = require('../../common/services/cms'),
    config = require('../../common/setup/config'),
    graceNote = require('../../common/services/grace-note'),
    PythonShell = require('python-shell'),
    mongoose = require('../../node_modules/mongoose'),
    User = mongoose.model('User'),
    Channel = mongoose.model('Channel'),
    Image = mongoose.model('Image'),
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
                return res.json(data.routes[0]);
            } else {
                return res.status(500).end();
            }
        });
    },

    getChannelGuide: function (req, res) {
        return res.json([]);
        cms.getLineup(req.query.id, 'today', function (err, data) {
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

    getUserChannels: function (req, res) {
        User.findOne({email: req.email}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('mediaController - getUserChannels - error fetching user: ' + req.email);
                logger.logError(err);
                return res.status(500).end();
            }
            cms.getChannels(user.account.type, function (err, data) {
                if (err) {
                    logger.logError('mediaController - getUserChannels - error fetching channels');
                    logger.logError(err);
                    return res.status(500).end();
                }
                if (data && data.channels_list && data.channels_list.length > 0) {
                    var channels = _.filter(data.channels_list, {status: '1'});
                    return res.json(channels);
                } else {
                    return res.status(500).end();
                }
            });
        });

    },

    getPromos: function (req, res) {
        CmsAd.find({}, function (err, promos) {
            if (err) {
                logger.logError('mediaController - getPromos - error fetching promos');
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(promos);
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
                return res.json(data.categories);
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

        Channel.find(req.query.stationIds === undefined ? {status: 'active'} : Array.isArray(req.query.stationIds) ? {stationId: {$in: req.query.stationIds}} : {stationId: req.query.stationIds}, projectionObj, function (err, channelsDb) {
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
        if (req.query.projections) {
            if (Array.isArray(req.query.projections)) {
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
        if (req.query.projections) {
            if (Array.isArray(req.query.projections)) {
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

    getChannelLogo: function (req, res) {

        Image.find(req.query.stationIds === undefined ? {active: true, type: 'channel'} : Array.isArray(req.query.stationIds) ? {identifier: {$in: req.query.stationIds}} : {identifier: req.query.stationIds})
            .populate('dataId').exec(function (err, images) {
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
