'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CmsChannel = new Schema({
    name: String,
    stationId: String,
    logo: String,
    package: String,
    genre: String,
    language: String,
    audience: String,
    region: String,
    videoUrl: String,
    favorite: Boolean
}, {collection: 'CmsChannels'});

mongoose.model('CmsChannel', CmsChannel);
