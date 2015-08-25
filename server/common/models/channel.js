'use strict';

var Program = require('./program');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Channel = new Schema({
    channel: String,
    callSign: String,
    stationId: String,
    status: String,
    preferredImage: {
        uri: String,
        height: String,
        width: String,
        size: String,
        aspect: String,
        text: String,
        primary: Boolean,
        category: String,
        tier: String,
        caption: {
            content: String,
            lang: String
        },
        personIds: [String]
    },
    airings: [Program]
}, {collection: 'Channels'});

mongoose.model('Channel', Channel);