'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Version = new Schema({
    webSliderVersion: String
}, { collection: 'Versions' });

mongoose.model('Version', Version);
