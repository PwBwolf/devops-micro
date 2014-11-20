'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Channel = new Schema({
    streams: {
        rtmp: {
            url240px: String,
            url480px: String,
            url720px: String,
            url1024px: String
        },
        hls: {
            url: String
        },
        hds: {
            url: String
        }
    },
    metadata: {
        en: {
            name: String,
            logo: String,
            description: String,
            genre: String
        },
        es: {
            name: String,
            logo: String,
            description: String,
            genre: String
        }
    },
    disabled: Boolean
});

mongoose.model('Channel', Channel);



