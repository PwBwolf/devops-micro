'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WebSlider = new Schema({
    order: {type: Number, required: true},
    image: {
        en: {type: String, required: true},
        es: {type: String, required: true}
    },
    coords: {
        en: {type: String, required: true},
        es: {type: String, required: true}
    },
    url: {type: String, required: true}
}, {collection: 'WebSliders'});

mongoose.model('WebSlider', WebSlider);
