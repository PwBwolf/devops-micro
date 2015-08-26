'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CmsChannel = new Schema({
    name: String
}, {collection: 'CmsChannels'});

mongoose.model('CmsChannel', CmsChannel);
