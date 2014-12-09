'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactUs = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, lowercase: true, trim: true},
    telephone: {type: String, required: true},
    ymId: {type: String},
    skypeId: {type: String},
    country: {type: String},
    interest: {type: String, required: true},
    details: {type: String, required: true},
    createdAt: {type: Date, required: true},
    deleted: Boolean

}, {collection: 'ContactUs'});

mongoose.model('ContactUs', ContactUs);
