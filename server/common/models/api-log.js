'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiLog = new Schema({
    name: String,
    type: String,
    requestTime: Date,
    responseTime: Date,
    clientId: String,
    apiKey: String,
    params: Object,
    body: Object
}, {collection: 'ApiLogs'});

mongoose.model('ApiLog', ApiLog);
