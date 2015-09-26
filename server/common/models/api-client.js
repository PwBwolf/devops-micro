'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiClient = new Schema({
    name: {type: String, required: true, trim: true, unique: true, uppercase: true},
    fullName: {type: String, required: true, trim: true},
    email: {type: String, required: true, lowercase: true, trim: true},
    createdAt: {type: Date, required: true},
    address: {type: String, required: true, trim: true},
    telephone: {type: String, required: true, trim: true},
    apiKey: {type: String, required: true},
    apiType: {type: String, required: true}
}, {collection: 'ApiClients'});

mongoose.model('ApiClient', ApiClient);
