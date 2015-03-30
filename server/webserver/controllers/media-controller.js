'use strict';

var fs = require('fs'),
    crypto = require('crypto'),
    URI = require('URIjs'),
    _ = require('lodash');

module.exports = {
    getChannel: function (req, res) {
        fs.readFile(__dirname + '/channels.json', 'utf8', function (err, data) {
            if (err) {
                console.log('Error reading channels.json' + err);
                return res.status(500).end();
            } else {
                var channels;
                try {
                    channels = JSON.parse(data);
                } catch (ex) {
                    console.log('Error parsing channels.json file. Correct format errors and try again.');
                    return res.status(500).end();
                }
                if (!channels || channels.length === 0) {
                    console.log('channels.json file is empty');
                    return res.status(500).end();
                } else {
                    var channel = _.find(channels, function(channel) {
                        return channel.id === req.query.channelId;
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
                    if(hash.length > 20) {
                        hash = hash.substr(0, 20);
                    }
                    channel.live_pc_url = channel.live_pc_url + '?valid_from=' + validFrom + '&valid_to=' + validTo + '&hash=5' + hash;
                    return res.json(channel);
                }
            }
        });
    },

    getUserChannels: function(req, res) {
        fs.readFile(__dirname + '/channels.json', 'utf8', function (err, data) {
            if (err) {
                console.log('Error reading channels.json' + err);
                return res.status(500).end();
            } else {
                var channels;
                try {
                    channels = JSON.parse(data);
                } catch (ex) {
                    console.log('Error parsing channels.json file. Correct format errors and try again.');
                    return res.status(500).end();
                }
                if (!channels || channels.length === 0) {
                    console.log('channels.json file is empty');
                    return res.status(500).end();
                } else {
                    return res.json(channels);
                }
            }
        });
    }
};
