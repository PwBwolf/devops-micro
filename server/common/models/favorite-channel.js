'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FavoriteChannel = new Schema({
    email: String,
    channels: [{
        channelId: String,
        userType: Number
    }]
}, {collection: 'FavoriteChannels'});

mongoose.model('FavoriteChannel', FavoriteChannel);
