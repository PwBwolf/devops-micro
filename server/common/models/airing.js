'use strict';

var Epg = require('./epg');
var mongoose = require('../../node_modules/mongoose');
var Schema = mongoose.Schema;

var Airing = new Schema({
    source: String,
    fileName: String,
    type: String,
    airings: [Epg]
}, {collection: 'Airings'});

mongoose.model('Airing', Airing);
