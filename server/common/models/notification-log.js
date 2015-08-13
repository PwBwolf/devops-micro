'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationLog = new Schema({
    name: String,
    requestTime: Date,
    responseTime: Date,
    notificationClientId: String,
    apiKey: String,
    params: Object,
    body: Object
}, { collection: 'NotificationLogs' });

mongoose.model('NotificationLog', NotificationLog);
