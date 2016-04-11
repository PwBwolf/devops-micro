'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Dunning = new Schema({
    username: String,
    days: Number,
    submitTime: Date,
    clientId: String,
    status: String,
    reason: String,
    processTime: Date,
    payload: Object,
    type: String
}, {collection: 'Dunning'});

mongoose.model('Dunning', Dunning);
