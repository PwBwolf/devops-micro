'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Merchant = new Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    createdAt: {type: Date, required: true},
    address: {type: String, required: true},
    telephone: {type: String, required: true},
    apiKey: {type: String, required: true}
}, {collection: 'Merchants'});

mongoose.model('Merchant', Merchant);