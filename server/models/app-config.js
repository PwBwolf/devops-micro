'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppConfig = new Schema({
    appName: String,
    customerCareNumber: String
});

mongoose.model('AppConfig', AppConfig);
