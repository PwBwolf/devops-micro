'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppConfig = new Schema({
    appName: String,
    customerCareNumber: String,
    webSliderVersion: String
}, { collection: 'AppConfig' });

mongoose.model('AppConfig', AppConfig);
