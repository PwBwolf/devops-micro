'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FavoriteChannel = new Schema({
    email: String,
    channels: [{
        channel_id: String,
        user_type: Number
    }]
}, {collection: 'FavoriteChannels'});

mongoose.model('FavoriteChannel', FavoriteChannel);