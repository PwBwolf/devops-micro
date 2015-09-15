'use strict';

var mongoose = require('../../../../server/node_modules/mongoose');

var Schema = mongoose.Schema;

var Airing = new Schema({
    source: String,    // stationId or tmsId
    fileName: String,
    type: String,
    airings: 
        [{
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
        }]
    }, {collection: 'Airings'});

mongoose.model('Airing', Airing);