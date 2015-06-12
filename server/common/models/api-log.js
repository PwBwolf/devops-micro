'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiLog = new Schema({
    name: String,
    requestTime: Date,
    responseTime: Date,
    merchantId: String,
    apiKey: String,
    params: Object,
    body: Object
}, { collection: 'ApiLogs' });

mongoose.model('ApiLog', ApiLog);