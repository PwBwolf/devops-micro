'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppConfig = new Schema({
    appName: String,
    customerCareNumber: String
}, { collection: 'AppConfig' });

mongoose.model('AppConfig', AppConfig);
