'use strict';

var mongoose = require('../../../../server/node_modules/mongoose');
var Schema = mongoose.Schema;

var Epg = new Schema({
    lp: String,
    title: String,
    startTime: Date,
    endTime: Date,
    synopsis: String,
    country: String,
    director: String,
    casting: String, 
    ageRating: String,
    genre: String,
    year: String,
    day: String,
    duration: String
}, {collection: 'Epgs', strict: false});

mongoose.model('Epg', Epg);